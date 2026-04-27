from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Ingredient, Tag
from app.schemas import IngredientOut, IngredientPage

router = APIRouter(prefix="/api/ingredients", tags=["ingredients"])


@router.get("", response_model=IngredientPage)
def list_ingredients(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    tag: str | None = Query(None),
    db: Session = Depends(get_db),
) -> IngredientPage:
    base = select(Ingredient)
    if tag is not None:
        base = base.join(Ingredient.tags).where(Tag.name == tag)
    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()
    items = list(
        db.execute(
            base.order_by(Ingredient.name).offset((page - 1) * page_size).limit(page_size)
        ).scalars()
    )
    return IngredientPage(items=items, total=total, page=page, page_size=page_size)


@router.get("/{ingredient_id}", response_model=IngredientOut)
def get_ingredient(ingredient_id: int, db: Session = Depends(get_db)) -> Ingredient:
    ing = db.get(Ingredient, ingredient_id)
    if ing is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return ing
