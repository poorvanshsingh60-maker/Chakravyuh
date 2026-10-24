import os
import json
import secrets
import hashlib
import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr
import jwt

SECRET_KEY = os.getenv("JWT_SECRET", "chakravyuh_mnnit_placement_secret_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
USERS_FILE = os.path.join(DATA_DIR, "users.json")

def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    return salt, key

def verify_password(password: str, salt: str, expected_hash: str) -> bool:
    _, key = hash_password(password, salt)
    return secrets.compare_digest(key, expected_hash)

def init_users_store():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(USERS_FILE):
        default_users = {}
        # Seed default users
        seeds = [
            ("admin@mnnit.ac.in", "mnnit2026", "Prof. Emma Watson (T&P)", "COORDINATOR", "coord-1"),
            ("sarah.chen@google.com", "google2026", "Dr. Sarah Chen (Google)", "INTERVIEWER", "int-1"),
            ("aditya.singh@mnnit.ac.in", "aditya2026", "Aditya Singh (20214012)", "CANDIDATE", "cand-1"),
        ]
        for email, pwd, name, role, uid in seeds:
            salt, hashed = hash_password(pwd)
            default_users[email.lower()] = {
                "id": uid,
                "email": email.lower(),
                "full_name": name,
                "role": role,
                "salt": salt,
                "password_hash": hashed,
                "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(default_users, f, indent=2)

def load_users() -> Dict[str, Any]:
    init_users_store()
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def save_users(users: Dict[str, Any]):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)

class SignUpRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "COORDINATOR"

class LoginRequest(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    role: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

def create_jwt_token(user_dict: dict) -> str:
    expires = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": user_dict["email"],
        "id": user_dict["id"],
        "full_name": user_dict["full_name"],
        "role": user_dict["role"],
        "exp": expires
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None
