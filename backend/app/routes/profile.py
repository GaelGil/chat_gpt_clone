from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User


profile = Blueprint('profile', __name__)

@profile.route('/profile/<int:user_id>', methods=['GET'])
@jwt_required()
def get_profile(user_id):
    current_user_id = get_jwt_identity()
    if user_id != int(current_user_id):   # convert to int for correct comparison
        return jsonify({'msg': 'unauthorized access'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    }), 200



