from flask import Blueprint, request, jsonify
from app.models.user import User
from app.extensions import db, bcrypt
from sqlalchemy.exc import IntegrityError
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.post import Post


posts = Blueprint('posts', __name__)

@posts.route('/posts/<int:user_id>', methods=['GET'])
@jwt_required()
def get_users_post(user_id):
    current_user_id = get_jwt_identity()
    if user_id != int(current_user_id):   # convert to int for correct comparison
        return jsonify({'msg': 'unauthorized access'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    
    posts = Post.query.filter_by(user_id=user_id).all()

    posts_data = [{
        'id': post.id,
        'content': post.content,
        'timestamp': post.timestamp
    } for post in posts]

    return jsonify(posts_data), 200
