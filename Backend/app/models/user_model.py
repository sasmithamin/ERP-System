from datetime import datetime

def user_document(email, hashed_password, role):
    return {
        "email": email,
        "hashed_password": hashed_password,
        "role": role,
        "is_active": True,
        "must_change_password": True,
        "created_at": datetime.utcnow()
    }
