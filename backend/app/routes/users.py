from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
users = Blueprint('users', __name__)

@users.route('/followers/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_friends(user_id):
    current_user_id = get_jwt_identity()
    if user_id != int(current_user_id):   # convert to int for correct comparison
        return jsonify({'msg': 'unauthorized access'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    

    followers_list = [
        {
            'id': follower.id,
            'username': follower.username,
        }
        for follower in user.followers
    ]

    return jsonify({'followers': followers_list}), 200


# @users.route('/user/<string:username>/', methods=['GET'])
# def get_user(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({'msg': 'User not found'}), 404
    
#     return jsonify({
#         'id': user.id,
#         'username': user.username,
#         'email': user.email
#     }), 200
