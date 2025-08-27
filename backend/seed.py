from app import create_app
from app.extensions import db, bcrypt
from app.user.models import User

app = create_app()

with app.app_context():
    # Check if users exists
    admin_exists = User.query.filter_by(username="admin").first()

    # add users if they dont exist
    if not admin_exists:
        admin = User(
            username="admin",
            email="admin@admin.com",
            password=bcrypt.generate_password_hash("password").decode("utf-8"),
        )

        db.session.add(admin)
        db.session.commit()

    print("Seed data added!")
