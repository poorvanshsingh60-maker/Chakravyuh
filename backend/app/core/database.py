from typing import Optional
from pymongo import MongoClient
from pymongo.database import Database
from app.config import settings

class DatabaseManager:
    client: Optional[MongoClient] = None
    db: Optional[Database] = None

    def connect_to_database(self) -> Database:
        if self.client is None:
            self.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
            self.db = self.client[settings.DB_NAME]
        return self.db

    def close_database_connection(self):
        if self.client:
            self.client.close()
            self.client = None
            self.db = None

    def get_db(self) -> Database:
        if self.db is None:
            return self.connect_to_database()
        return self.db


db_manager = DatabaseManager()


def get_database() -> Database:
    return db_manager.get_db()
