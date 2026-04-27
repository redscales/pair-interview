from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Ingredient, Recipe, RecipeIngredient, Tag
from app.pagination import apply_cursor, encode_cursor
from app.schemas import (
    RecipeDetail,
    RecipePage,
    RecipeWrite,
)

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


@router.get("", response_model=RecipePage)
def list_recipes(
    cursor: str | None = Query(None),
    page_size: int = Query(20, ge=1, le=100),
    tag: str | None = Query(None),
    db: Session = Depends(get_db),
) -> RecipePage:
    base = select(Recipe)
    if tag is not None:
        base = base.join(Recipe.tags).where(Tag.name == tag)
    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()

    stmt = apply_cursor(base.order_by(Recipe.id), Recipe.id, cursor)
    rows = list(db.execute(stmt.limit(page_size + 1)).scalars())
    has_more = len(rows) > page_size
    items = rows[:page_size]
    next_cursor = encode_cursor(items[-1].id) if has_more and items else None
    return RecipePage(items=items, total=total, page_size=page_size, next_cursor=next_cursor)


@router.get("/{recipe_id}", response_model=RecipeDetail)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)) -> Recipe:
    recipe = db.get(Recipe, recipe_id)
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


def _apply_write(recipe: Recipe, payload: RecipeWrite, db: Session) -> Recipe:
    recipe.title = payload.title
    recipe.description = payload.description
    recipe.tags = list(db.execute(select(Tag).where(Tag.id.in_(payload.tag_ids))).scalars())
    recipe.ingredient_links.clear()
    db.flush()
    for entry in payload.ingredients:
        ing = db.get(Ingredient, entry.ingredient_id)
        if ing is None:
            raise HTTPException(
                status_code=400, detail=f"Ingredient {entry.ingredient_id} not found"
            )
        recipe.ingredient_links.append(
            RecipeIngredient(
                recipe_id=recipe.id,
                ingredient_id=ing.id,
                quantity=entry.quantity,
                unit=entry.unit,
            )
        )
    return recipe


@router.post("", response_model=RecipeDetail, status_code=201)
def create_recipe(payload: RecipeWrite, db: Session = Depends(get_db)) -> Recipe:
    recipe = Recipe(title=payload.title, description=payload.description)
    db.add(recipe)
    db.flush()
    _apply_write(recipe, payload, db)
    db.commit()
    db.refresh(recipe)
    return recipe


@router.put("/{recipe_id}", response_model=RecipeDetail)
def update_recipe(
    recipe_id: int, payload: RecipeWrite, db: Session = Depends(get_db)
) -> Recipe:
    recipe = db.get(Recipe, recipe_id)
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    _apply_write(recipe, payload, db)
    db.commit()
    db.refresh(recipe)
    return recipe


@router.delete("/{recipe_id}", status_code=204)
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)) -> None:
    recipe = db.get(Recipe, recipe_id)
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    db.delete(recipe)
    db.commit()
