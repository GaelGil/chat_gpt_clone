import uuid
from datetime import datetime, timezone
from urllib.parse import urlparse
import re
from flask import request, jsonify
from flask import Blueprint

essay_writer = Blueprint("essay_writer", __name__, url_prefix="/essay_writer")


def extract_repo_name_from_url(url: str) -> str:
    """Extract repository name from GitHub URL"""
    try:
        # Remove trailing slash and fragments
        clean_url = url.rstrip("/").split("#")[0].split("?")[0]

        # Handle different GitHub URL formats
        patterns = [
            r"github\.com/([^/]+/[^/]+)/?$",  # https://github.com/owner/repo
            r"github\.com/([^/]+/[^/]+)/tree/.*$",  # https://github.com/owner/repo/tree/branch
            r"github\.com/([^/]+/[^/]+)/.*$",  # https://github.com/owner/repo/anything
        ]

        for pattern in patterns:
            match = re.search(pattern, clean_url)
            if match:
                return match.group(1)

        raise ValueError("Could not extract repository name")
    except Exception as e:
        raise ValueError(f"Invalid GitHub URL: {e}")


def is_valid_github_url(url: str) -> bool:
    """Validate GitHub URL format"""
    try:
        parsed = urlparse(url)
        return (
            parsed.scheme in ("http", "https")
            and parsed.netloc == "github.com"
            and bool(extract_repo_name_from_url(url))
        )
    except:
        return False

    # Routes


@essay_writer.route("/code-search/sessions", methods=["GET"])
def get_user_sessions():
    skip = request.args.get("skip", 0, type=int)
    limit = request.args.get("limit", 100, type=int)

    # Get sessions ordered by last_used (most recent first)

    return jsonify(
        CodeSearchSessionsPublic(
            data=[session.to_dict() for session in sessions], count=count
        ).to_dict()
    )


@essay_writer.route("/code-search/sessions", methods=["POST"])
def create_session():
    request_data = request.get_json()
    session_in = CodeSearchSessionCreate(**request_data)
    # Validate GitHub URL if provided
    if session_in.github_url:
        if not is_valid_github_url(session_in.github_url):
            return jsonify(
                {
                    "detail": "Invalid GitHub URL. Please provide a valid GitHub repository URL."
                }
            ), 400
        # Extract repository name for uniqueness check
        try:
            repo_name = extract_repo_name_from_url(session_in.github_url)
        except ValueError as e:
            return jsonify({"detail": str(e)}), 400
        # Check if user already has a session for this repository
        existing_session = (
            db.session.query(CodeSearchSession)
            .filter(
                CodeSearchSession.owner_id == current_user.id,
                CodeSearchSession.github_url == session_in.github_url,
            )
            .first()
        )
        if existing_session:
            # Update last_used and return existing session
            existing_session.last_used = datetime.now(timezone.utc)
            db.session.commit()
            return jsonify(existing_session.to_dict())
    # Create new session
    db_session = CodeSearchSession(**session_in.dict(), owner_id=current_user.id)
    db.session.add(db_session)
    db.session.commit()
    # Start background embedding generation if GitHub URL provided
    if session_in.github_url:
        background_tasks.add_task(
            embedding_service.generate_embeddings_for_session,
            db_session.id,
            session_in.github_url,
        )
    return jsonify(db_session.to_dict())


@essay_writer.route("/code-search/sessions/<session_id>", methods=["GET"])
def get_session(session_id: uuid.UUID):
    current_user = get_current_user()
    db_session = (
        db.session.query(CodeSearchSession)
        .filter(
            CodeSearchSession.id == session_id,
            CodeSearchSession.owner_id == current_user.id,
        )
        .first()
    )
    if not db_session:
        return jsonify({"detail": "Session not found"}), 404
    return jsonify(db_session.to_dict())


@essay_writer.route("/code-search/sessions/<session_id>", methods=["PUT"])
def update_session(session_id: uuid.UUID):
    request_data = request.get_json()
    current_user = get_current_user()
    session_update = CodeSearchSessionUpdate(**request_data)
    db_session = (
        db.session.query(CodeSearchSession)
        .filter(
            CodeSearchSession.id == session_id,
            CodeSearchSession.owner_id == current_user.id,
        )
        .first()
    )
    if not db_session:
        return jsonify({"detail": "Session not found"}), 404
    # Update fields
    session_data = session_update.dict(exclude_unset=True)
    session_data["updated_at"] = datetime.now(timezone.utc)
    for field, value in session_data.items():
        setattr(db_session, field, value)
    db.session.commit()
    return jsonify(db_session.to_dict())


@essay_writer.route("/code-search/sessions/<session_id>", methods=["DELETE"])
def delete_session(session_id: uuid.UUID):
    current_user = get_current_user()
    db_session = (
        db.session.query(CodeSearchSession)
        .filter(
            CodeSearchSession.id == session_id,
            CodeSearchSession.owner_id == current_user.id,
        )
        .first()
    )
    if not db_session:
        return jsonify({"detail": "Session not found"}), 404
    db.session.delete(db_session)
    db.session.commit()
    return jsonify({"message": "Session deleted successfully"})


@essay_writer.route(
    "/code-search/sessions/<session_id>/embeddings-status", methods=["GET"]
)
def get_embeddings_status(session_id: uuid.UUID):
    current_user = get_current_user()
    db_session = (
        db.session.query(CodeSearchSession)
        .filter(
            CodeSearchSession.id == session_id,
            CodeSearchSession.owner_id == current_user.id,
        )
        .first()
    )
    if not db_session:
        return jsonify({"detail": "Session not found"}), 404
    # Get embeddings count
    embeddings_count = len(db_session.embeddings) if db_session.embeddings else 0
    return jsonify(
        {
            "session_id": session_id,
            "embeddings_processed": db_session.vector_embeddings_processed,
            "embeddings_count": embeddings_count,
            "created_at": db_session.created_at,
            "updated_at": db_session.updated_at,
        }
    )


@essay_writer.route(
    "/code-search/sessions/<session_id>/regenerate-embeddings", methods=["POST"]
)
def regenerate_embeddings(session_id: uuid.UUID):
    current_user = get_current_user()
    db_session = (
        db.session.query(CodeSearchSession)
        .filter(
            CodeSearchSession.id == session_id,
            CodeSearchSession.owner_id == current_user.id,
        )
        .first()
    )
    if not db_session:
        return jsonify({"detail": "Session not found"}), 404
    if not db_session.github_url:
        return jsonify(
            {"detail": "Cannot regenerate embeddings for sessions without a GitHub URL"}
        ), 400
    # Reset embeddings status
    db_session.vector_embeddings_processed = False
    db_session.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    # Start background embedding generation
    background_tasks.add_task(
        embedding_service.generate_embeddings_for_session,
        session_id,
        db_session.github_url,
    )
    return jsonify({"message": "Embeddings regeneration started"})
