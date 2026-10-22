from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field, GetJsonSchemaHandler
from pydantic_core import core_schema
from bson import ObjectId


class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(lambda x: str(x)),
        )

    @classmethod
    def validate(cls, value: Any) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError(f"Invalid ObjectId: {value}")
        return ObjectId(value)


class TimeSlot(BaseModel):
    start_time: datetime
    end_time: datetime

    @property
    def duration_minutes(self) -> int:
        return int((self.end_time - self.start_time).total_seconds() / 60)


class BaseAuditModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str, datetime: lambda dt: dt.isoformat()}
