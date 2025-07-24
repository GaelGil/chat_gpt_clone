from typing import Any, List
import json
import logging
from flask import request, jsonify, Response
from app.services.agent_service import agent_service


logger = logging.getLogger(__name__)

# router = APIRouter(tags=["agents"])


# Request/Response Models
class AgentQueryRequest:
    def __init__(self, query: str, context_id: str, agent_type: str = "orchestrator"):
        self.query = query
        self.context_id = context_id
        self.agent_type = agent_type


class AgentQueryResponse:
    def __init__(
        self,
        response_type: str,
        is_task_complete: bool,
        require_user_input: bool,
        content: Any,
    ):
        self.response_type = response_type
        self.is_task_complete = is_task_complete
        self.require_user_input = require_user_input
        self.content = content

    def to_dict(self):
        return {
            "response_type": self.response_type,
            "is_task_complete": self.is_task_complete,
            "require_user_input": self.require_user_input,
            "content": self.content,
        }


class AgentStatusResponse:
    def __init__(
        self,
        agent_name: str,
        agent_type: str,
        status: str,
        description: str,
        capabilities: List[str],
        is_active: bool,
    ):
        self.agent_name = agent_name
        self.agent_type = agent_type
        self.status = status
        self.description = description
        self.capabilities = capabilities
        self.is_active = is_active

    def to_dict(self):
        return {
            "agent_name": self.agent_name,
            "agent_type": self.agent_type,
            "status": self.status,
            "description": self.description,
            "capabilities": self.capabilities,
            "is_active": self.is_active,
        }


# Routes
def register_routes(app):
    @app.route("/agents/status", methods=["GET"])
    def get_agents_status():
        try:
            agents_status_list = agent_service.get_all_agents_status()
            result = [
                AgentStatusResponse(
                    status["agent_name"],
                    status["agent_type"],
                    status["status"],
                    status["description"],
                    status["capabilities"],
                    status["is_active"],
                ).to_dict()
                for status in agents_status_list
            ]
            return jsonify(result)

        except Exception as e:
            logger.error(f"Error getting agents status: {e}")
            return jsonify({"detail": "Failed to get agents status"}), 500

    @app.route("/agents/query", methods=["POST"])
    def query_agent():
        request_data = request.get_json()

        try:
            if not request_data["query"].strip():
                return jsonify({"detail": "Query cannot be empty"}), 400

            # Generate a task ID for this query
            task_id = f"task_{request_data['context_id']}"

            # Execute the query (collect all responses)
            responses = []
            for chunk in agent_service.query_agent(
                request_data["agent_type"],
                request_data["query"],
                request_data["context_id"],
                task_id,
            ):
                responses.append(chunk)

            # Return the last response (typically the final result)
            if responses:
                final_response = responses[-1]
                return jsonify(
                    AgentQueryResponse(
                        final_response.get("response_type", "text"),
                        final_response.get("is_task_complete", True),
                        final_response.get("require_user_input", False),
                        final_response.get("content", ""),
                    ).to_dict()
                )
            else:
                return jsonify(
                    AgentQueryResponse(
                        "text", True, False, "No response from agent"
                    ).to_dict()
                )

        except ValueError as e:
            logger.error(f"Invalid request: {e}")
            return jsonify({"detail": str(e)}), 400
        except Exception as e:
            logger.error(f"Error querying agent: {e}")
            return jsonify({"detail": f"Failed to query agent: {str(e)}"}), 500

    @app.route("/agents/query/stream", methods=["POST"])
    def query_agent_stream():
        request_data = request.get_json()

        try:
            if not request_data["query"].strip():
                return jsonify({"detail": "Query cannot be empty"}), 400

            # Generate a task ID for this query
            task_id = f"task_{request_data['context_id']}"

            def generate_stream():
                try:
                    for chunk in agent_service.query_agent(
                        request_data["agent_type"],
                        request_data["query"],
                        request_data["context_id"],
                        task_id,
                    ):
                        yield f"data: {json.dumps(chunk)}\n\n"
                except Exception as e:
                    logger.error(f"Error in stream generation: {e}")
                    yield f"data: {json.dumps({'error': str(e)})}\n\n"

            return Response(generate_stream(), content_type="text/event-stream")

        except Exception as e:
            logger.error(f"Error setting up stream: {e}")
            return jsonify({"detail": f"Failed to setup stream: {str(e)}"}), 500

    @app.route("/agents/code-search", methods=["POST"])
    def perform_code_search():
        request_data = request.get_json()

        try:
            task_id = f"task_{request_data['context_id']}"
            responses = []
            for chunk in agent_service.perform_code_search(
                request_data["query"], request_data["context_id"], task_id
            ):
                responses.append(chunk)

            if responses:
                final_response = responses[-1]
                return jsonify(
                    AgentQueryResponse(
                        final_response.get("response_type", "text"),
                        final_response.get("is_task_complete", True),
                        final_response.get("require_user_input", False),
                        final_response.get("content", ""),
                    ).to_dict()
                )
            else:
                return jsonify(
                    AgentQueryResponse(
                        "text", True, False, "No response from agent"
                    ).to_dict()
                )

        except Exception as e:
            logger.error(f"Error performing code search: {e}")
            return jsonify({"detail": f"Failed to perform code search: {str(e)}"}), 500

    @app.route("/agents/code-search/summary/<context_id>", methods=["GET"])
    def get_code_search_summary(context_id: str):
        try:
            summary = agent_service.generate_code_search_summary(context_id)
            return jsonify(summary)

        except Exception as e:
            logger.error(f"Error getting code search summary: {e}")
            return jsonify(
                {"detail": f"Failed to get code search summary: {str(e)}"}
            ), 500

    @app.route("/agents/context/<context_id>", methods=["DELETE"])
    def clear_agent_context(context_id: str):
        try:
            result = agent_service.clear_agent_context(context_id)
            return jsonify(result)

        except Exception as e:
            logger.error(f"Error clearing context: {e}")
            return jsonify({"detail": f"Failed to clear context: {str(e)}"}), 500

    # Specialized routes for agent types
    @app.route("/agents/semantic-search", methods=["POST"])
    def perform_semantic_search():
        request_data = request.get_json()

        try:
            request_data["agent_type"] = "code_search"
            return query_agent()

        except Exception as e:
            logger.error(f"Error performing semantic search: {e}")
            return jsonify(
                {"detail": f"Failed to perform semantic search: {str(e)}"}
            ), 500

    @app.route("/agents/code-analysis", methods=["POST"])
    def perform_code_analysis():
        request_data = request.get_json()

        try:
            request_data["agent_type"] = "code_analysis"
            return query_agent()

        except Exception as e:
            logger.error(f"Error performing code analysis: {e}")
            return jsonify(
                {"detail": f"Failed to perform code analysis: {str(e)}"}
            ), 500

    @app.route("/agents/documentation", methods=["POST"])
    def generate_documentation():
        request_data = request.get_json()

        try:
            request_data["agent_type"] = "code_documentation"
            return query_agent()

        except Exception as e:
            logger.error(f"Error generating documentation: {e}")
            return jsonify(
                {"detail": f"Failed to generate documentation: {str(e)}"}
            ), 500
