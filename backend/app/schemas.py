from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TagOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str


class IngredientOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    tags: list[TagOut] = []


class RecipeIngredientOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    ingredient: IngredientOut
    quantity: float
    unit: str


class RecipeListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    tags: list[TagOut] = []


class RecipeDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    created_at: datetime
    tags: list[TagOut] = []
    ingredient_links: list[RecipeIngredientOut] = []


class RecipeIngredientWrite(BaseModel):
    ingredient_id: int
    quantity: float
    unit: str


class RecipeWrite(BaseModel):
    title: str = Field(min_length=1)
    description: str = ""
    tag_ids: list[int] = []
    ingredients: list[RecipeIngredientWrite] = []


class CursorPage(BaseModel):
    items: list[RecipeListItem]
    next_cursor: int | None


class IngredientPage(BaseModel):
    items: list[IngredientOut]
    total: int
    page: int
    page_size: int
