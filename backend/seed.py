"""Idempotent deterministic seed for the recipe library."""
from __future__ import annotations

import random

from sqlalchemy import select

from app.db import Base, SessionLocal, engine
from app.models import Ingredient, Recipe, RecipeIngredient, Tag


TAG_NAMES = [
    "italian", "mexican", "thai", "indian", "japanese", "french", "american",
    "vegetarian", "vegan", "gluten-free", "dairy-free", "spicy", "quick",
    "dessert", "breakfast", "soup", "salad",
]

INGREDIENT_NAMES = [
    "flour", "sugar", "salt", "butter", "olive oil", "garlic", "onion", "tomato",
    "basil", "oregano", "parmesan", "mozzarella", "egg", "milk", "yeast", "rice",
    "soy sauce", "ginger", "chili", "lime", "coconut milk", "cilantro", "cumin",
    "coriander", "turmeric", "paprika", "black pepper", "white pepper", "honey",
    "vanilla", "cinnamon", "nutmeg", "almonds", "walnuts", "pecans", "raisins",
    "apple", "banana", "lemon", "orange", "blueberry", "strawberry", "raspberry",
    "carrot", "celery", "potato", "sweet potato", "broccoli", "spinach", "kale",
    "lettuce", "cucumber", "bell pepper", "jalapeno", "avocado", "mushroom",
    "chicken", "beef", "pork", "shrimp", "salmon", "tuna", "tofu", "tempeh",
    "black beans", "chickpeas", "lentils", "kidney beans", "pinto beans",
    "pasta", "spaghetti", "penne", "linguine", "couscous", "quinoa", "barley",
    "bread", "tortilla", "pita", "naan", "bagel", "english muffin",
    "cheddar", "feta", "goat cheese", "yogurt", "sour cream", "cream cheese",
    "heavy cream", "buttermilk", "vegetable broth", "chicken broth",
    "white wine", "red wine", "balsamic vinegar", "rice vinegar", "sesame oil",
    "peanut butter", "almond butter", "tahini", "miso", "fish sauce", "sriracha",
    "mustard", "mayonnaise", "ketchup", "bbq sauce", "worcestershire",
    "rosemary", "thyme", "sage", "mint", "parsley", "dill", "tarragon",
    "shallot", "leek", "scallion", "fennel", "asparagus", "zucchini",
    "eggplant", "cauliflower", "brussels sprouts", "cabbage", "radish",
    "beet", "turnip", "parsnip", "corn", "peas", "green beans",
    "olives", "capers", "anchovies", "sun-dried tomatoes", "roasted red pepper",
    "pine nuts", "cashews", "peanuts", "sesame seeds", "poppy seeds",
    "chia seeds", "flax seeds", "pumpkin seeds", "sunflower seeds",
    "dark chocolate", "cocoa powder", "powdered sugar", "brown sugar",
    "maple syrup", "molasses", "agave",
    "baking soda", "baking powder", "cornstarch", "gelatin",
    "espresso", "matcha", "rosewater", "saffron", "vanilla bean", "cardamom",
    "star anise", "fennel seed", "mustard seed", "celery seed", "caraway",
    "bay leaf", "tarragon vinegar", "sherry vinegar", "champagne vinegar",
    "tamarind", "lemongrass", "kaffir lime", "galangal",
    "ricotta", "mascarpone", "cottage cheese",
    "duck", "lamb", "venison", "rabbit",
    "mussels", "clams", "scallops", "lobster", "crab", "octopus",
    "smoked paprika", "ancho chili", "chipotle", "harissa", "ras el hanout",
    "garam masala", "curry powder", "tikka masala paste", "berbere",
]


# 100+ deterministic recipe titles. Sorted alphabetically before insert so
# id ordering is stable and the page-2 boundary recipe is reproducible.
RECIPE_TITLES = sorted([
    "Almond Crusted Salmon", "Apple Cinnamon Oatmeal", "Avocado Toast", "Baked Mac and Cheese",
    "Banana Bread", "Basil Pesto Pasta", "BBQ Pulled Pork", "Beef Bourguignon",
    "Beef Stir Fry", "Berry Smoothie Bowl", "Black Bean Burger", "Blueberry Pancakes",
    "Bouillabaisse", "Brioche French Toast", "Buffalo Wings", "Butter Chicken",
    "Caesar Salad", "Caprese Salad", "Carbonara", "Cauliflower Tikka",
    "Cheesecake", "Cherry Clafoutis", "Chicken Adobo", "Chicken Pad Thai",
    "Chicken Parmesan", "Chicken Piccata", "Chicken Tikka Masala", "Chickpea Curry",
    "Chili Con Carne", "Chocolate Chip Cookies", "Chocolate Lava Cake", "Chocolate Mousse",
    "Cioppino", "Clam Chowder", "Coq au Vin", "Corn Chowder",
    "Couscous Salad", "Crab Cakes", "Crab Rangoon", "Creme Brulee",
    "Crispy Tofu", "Cucumber Sandwich", "Curry Laksa", "Dal Makhani",
    "Dim Sum Dumplings", "Dirty Rice", "Drunken Noodles", "Duck Confit",
    "Eggplant Parmesan", "Falafel Wrap", "Fettuccine Alfredo", "Fish Tacos",
    "French Onion Soup", "Fried Rice", "Garlic Bread", "Gazpacho",
    "Gnocchi", "Greek Salad", "Green Curry", "Grilled Cheese",
    "Gumbo", "Gyros", "Halloumi Salad", "Hot Pot",
    "Hummus Plate", "Idli Sambar", "Jambalaya", "Jerk Chicken",
    "Kale Caesar", "Kimchi Fried Rice", "Korean BBQ", "Lamb Tagine",
    "Lasagna", "Lemon Cake", "Lentil Soup", "Lobster Bisque",
    "Mac and Cheese", "Margherita Pizza", "Massaman Curry", "Meatballs",
    "Minestrone", "Miso Soup", "Mushroom Risotto", "Nachos",
    "Nasi Goreng", "Niçoise Salad", "Okonomiyaki", "Onion Bhaji",
    "Pad See Ew", "Paella", "Pancakes", "Panna Cotta",
    "Penne Arrabiata", "Pho", "Pierogi", "Pina Colada Pie",
    "Pork Belly Bao", "Pork Tonkatsu", "Pot Roast", "Pulled Pork Sandwich",
    "Quiche Lorraine", "Ramen", "Ratatouille", "Red Curry",
    "Risotto Milanese", "Roast Chicken", "Roasted Vegetables", "Salmon Teriyaki",
    "Sashimi Plate", "Schnitzel", "Seafood Paella", "Shakshuka",
    "Shepherd's Pie", "Shrimp Scampi", "Sole Meunière", "Spaghetti Carbonara",
    "Spanakopita", "Spring Rolls", "Steak Frites", "Sushi Rolls",
    "Sweet Potato Fries", "Tabbouleh", "Taco Salad", "Thai Basil Beef",
    "Tiramisu", "Tom Kha Gai", "Tom Yum Soup", "Tortilla Espanola",
    "Tres Leches Cake", "Turkey Burger", "Udon Noodle Soup", "Vegetable Curry",
    "Vegetable Lasagna", "Vegetarian Chili", "Vichyssoise", "Vietnamese Pho",
    "Waldorf Salad", "Watermelon Salad", "Yorkshire Pudding", "Zucchini Bread",
])


def already_seeded(db) -> bool:
    return db.execute(select(Recipe).limit(1)).first() is not None


def main() -> None:
    Base.metadata.create_all(engine)
    rng = random.Random(42)

    with SessionLocal() as db:
        if already_seeded(db):
            print("DB already seeded; skipping.")
            return

        tags = [Tag(name=n) for n in TAG_NAMES]
        db.add_all(tags)
        db.flush()

        ingredients = [Ingredient(name=n) for n in INGREDIENT_NAMES]
        db.add_all(ingredients)
        db.flush()

        for ing in ingredients:
            n_tags = rng.randint(0, 3)
            ing.tags = rng.sample(tags, n_tags)

        for title in RECIPE_TITLES:
            n_tags = rng.randint(1, 4)
            r_tags = rng.sample(tags, n_tags)
            n_ings = rng.randint(3, 8)
            r_ings = rng.sample(ingredients, n_ings)
            recipe = Recipe(
                title=title,
                description=f"A delicious {title.lower()}.",
                tags=r_tags,
            )
            db.add(recipe)
            db.flush()
            for ing in r_ings:
                db.add(
                    RecipeIngredient(
                        recipe_id=recipe.id,
                        ingredient_id=ing.id,
                        quantity=round(rng.uniform(0.25, 4.0), 2),
                        unit=rng.choice(["g", "kg", "ml", "cup", "tbsp", "tsp", "piece"]),
                    )
                )

        db.commit()
        print(
            f"Seeded {len(tags)} tags, {len(ingredients)} ingredients, {len(RECIPE_TITLES)} recipes."
        )


if __name__ == "__main__":
    main()
