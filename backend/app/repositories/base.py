from datetime import datetime
from typing import Any, Dict, Generic, List, Optional, TypeVar
from bson import ObjectId
from pymongo.collection import Collection
from pymongo.database import Database

T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, db: Database, collection_name: str):
        self.db = db
        self.collection_name = collection_name
        self.collection: Collection = db[collection_name]

    def _to_object_id(self, id_str: str) -> ObjectId:
        try:
            return ObjectId(id_str)
        except Exception:
            return id_str  # type: ignore

    def _normalize_doc(self, doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if not doc:
            return None
        doc["id"] = str(doc.get("_id", ""))
        return doc

    def find_all(self, filter_query: Optional[Dict[str, Any]] = None, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        query = filter_query or {}
        cursor = self.collection.find(query).skip(skip).limit(limit)
        results = []
        for doc in cursor:
            results.append(self._normalize_doc(doc))
        return results

    def find_by_id(self, item_id: str) -> Optional[Dict[str, Any]]:
        doc = self.collection.find_one({"_id": self._to_object_id(item_id)})
        return self._normalize_doc(doc)

    def create(self, item_data: Dict[str, Any]) -> Dict[str, Any]:
        data = item_data.copy()
        now = datetime.utcnow()
        data["created_at"] = data.get("created_at", now)
        data["updated_at"] = now
        
        result = self.collection.insert_one(data)
        data["id"] = str(result.inserted_id)
        data["_id"] = result.inserted_id
        return data

    def update(self, item_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        data = {k: v for k, v in update_data.items() if v is not None}
        data["updated_at"] = datetime.utcnow()
        
        result = self.collection.find_one_and_update(
            {"_id": self._to_object_id(item_id)},
            {"$set": data},
            return_document=True
        )
        return self._normalize_doc(result)

    def delete(self, item_id: str) -> bool:
        result = self.collection.delete_one({"_id": self._to_object_id(item_id)})
        return result.deleted_count > 0

    def count(self, filter_query: Optional[Dict[str, Any]] = None) -> int:
        return self.collection.count_documents(filter_query or {})
