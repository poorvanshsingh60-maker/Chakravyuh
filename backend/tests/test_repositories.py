import pytest
from app.repositories.base import BaseRepository


class MockCollection:
    def __init__(self):
        self.docs = []

    def insert_one(self, data):
        data["_id"] = f"mock_{len(self.docs) + 1}"
        self.docs.append(data)
        class MockResult:
            inserted_id = data["_id"]
        return MockResult()

    def find(self, query=None):
        class MockCursor:
            def __init__(self, items):
                self.items = items
            def skip(self, n):
                return self
            def limit(self, n):
                return self
            def __iter__(self):
                return iter(self.items)
        return MockCursor(self.docs)

    def find_one(self, query):
        for doc in self.docs:
            if "_id" in query and doc.get("_id") == query["_id"]:
                return doc
        return None

    def find_one_and_update(self, query, update, return_document=True):
        doc = self.find_one(query)
        if doc and "$set" in update:
            doc.update(update["$set"])
            return doc
        return None

    def delete_one(self, query):
        initial = len(self.docs)
        self.docs = [d for d in self.docs if d.get("_id") != query.get("_id")]
        class MockResult:
            deleted_count = initial - len(self.docs)
        return MockResult()

    def count_documents(self, query):
        return len(self.docs)


class MockDatabase:
    def __init__(self):
        self.collections = {}

    def __getitem__(self, name):
        if name not in self.collections:
            self.collections[name] = MockCollection()
        return self.collections[name]


def test_base_repository_crud():
    db = MockDatabase()
    repo = BaseRepository(db, "test_items")

    # Create
    item = repo.create({"name": "Item 1", "value": 100})
    assert item["id"] == "mock_1"
    assert item["name"] == "Item 1"

    # Find All
    items = repo.find_all()
    assert len(items) == 1

    # Update
    updated = repo.update("mock_1", {"name": "Updated Item 1"})
    assert updated["name"] == "Updated Item 1"

    # Delete
    deleted = repo.delete("mock_1")
    assert deleted is True
    assert repo.count() == 0
