import bcrypt
import hashlib
import secrets


def normalize_password(password: str) -> bytes:
    """Convert any-length password into a fixed-length ASCII bytes (64 bytes).

    We use SHA-256 hex digest (64 ASCII chars) which is safely under bcrypt's
    72-byte input limit, and deterministic across runs.
    """
    return hashlib.sha256(password.encode("utf-8")).hexdigest().encode("ascii")


def hash_password(password: str) -> str:
    """Hash a password using the bcrypt library on a normalized input.

    Returns an ASCII string (decoded bytes) suitable for storing in a text
    database column.
    """
    norm = normalize_password(password)
    hashed = bcrypt.hashpw(norm, bcrypt.gensalt())
    return hashed.decode("ascii")


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against a stored bcrypt hash (ASCII string)."""
    norm = normalize_password(password)
    return bcrypt.checkpw(norm, hashed.encode("ascii"))


def generate_token() -> str:
    return secrets.token_urlsafe(32)
