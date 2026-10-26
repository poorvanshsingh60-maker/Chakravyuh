import os
import json
import secrets
import hashlib
import datetime
import urllib.request
import urllib.error
import urllib.parse
from typing import Optional, Dict, Any
from pydantic import BaseModel
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

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    access_token: Optional[str] = None
    role: str = "COORDINATOR"

class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    picture: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

def verify_google_token(credential: Optional[str] = None, access_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Verifies a Google OAuth ID token (credential) or OAuth2 access token with Google's public endpoints.
    Returns: { 'sub': str, 'email': str, 'name': str, 'picture': str }
    """
    if not credential and not access_token:
        raise ValueError("Either Google credential (ID token) or access_token is required.")

    if credential:
        query = urllib.parse.urlencode({"id_token": credential})
        url = f"https://oauth2.googleapis.com/tokeninfo?{query}"
        req = urllib.request.Request(url, headers={"User-Agent": "Chakravyuh-Auth/1.0"})
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode("utf-8"))
                if "error" in data:
                    raise ValueError(data.get("error_description", "Invalid Google ID token."))
                email = data.get("email")
                if not email:
                    raise ValueError("No verified email associated with this Google account.")
                return {
                    "sub": data.get("sub", ""),
                    "email": email.lower().strip(),
                    "name": data.get("name") or email.split("@")[0],
                    "picture": data.get("picture", "")
                }
        except urllib.error.HTTPError as e:
            try:
                err_body = json.loads(e.read().decode("utf-8"))
                msg = err_body.get("error_description", err_body.get("error", "Google ID token validation failed."))
            except Exception:
                msg = f"Google verification HTTP error ({e.code})"
            raise ValueError(msg)
        except Exception as e:
            raise ValueError(f"Failed to connect to Google OAuth servers: {str(e)}")

    if access_token:
        url = "https://www.googleapis.com/oauth2/v3/userinfo"
        req = urllib.request.Request(
            url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "User-Agent": "Chakravyuh-Auth/1.0"
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode("utf-8"))
                if "error" in data:
                    raise ValueError(data.get("error_description", "Invalid Google access token."))
                email = data.get("email")
                if not email:
                    raise ValueError("No verified email associated with this Google account.")
                return {
                    "sub": data.get("sub", ""),
                    "email": email.lower().strip(),
                    "name": data.get("name") or email.split("@")[0],
                    "picture": data.get("picture", "")
                }
        except urllib.error.HTTPError as e:
            try:
                err_body = json.loads(e.read().decode("utf-8"))
                msg = err_body.get("error_description", err_body.get("error", "Google access token validation failed."))
            except Exception:
                msg = f"Google verification HTTP error ({e.code})"
            raise ValueError(msg)
        except Exception as e:
            raise ValueError(f"Failed to connect to Google OAuth servers: {str(e)}")

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
