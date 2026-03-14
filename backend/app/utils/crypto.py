import base64
import hashlib

from cryptography.fernet import Fernet

from app.core.config import settings


class FieldCrypto:
    def __init__(self):
        key = base64.urlsafe_b64encode(hashlib.sha256(settings.secret_key.encode()).digest())
        self.fernet = Fernet(key)

    def encrypt(self, value: str) -> str:
        if not value:
            return ""
        return self.fernet.encrypt(value.encode()).decode()

    def decrypt(self, value: str) -> str:
        if not value:
            return ""
        try:
            return self.fernet.decrypt(value.encode()).decode()
        except Exception:
            return ""


field_crypto = FieldCrypto()
