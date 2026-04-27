export type Tag = { id: number; name: string };

export type Ingredient = {
  id: number;
  name: string;
  tags: Tag[];
};

export type RecipeIngredient = {
  ingredient: Ingredient;
  quantity: number;
  unit: string;
};

export type RecipeListItem = {
  id: number;
  title: string;
  tags: Tag[];
};

export type RecipeDetail = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  tags: Tag[];
  ingredient_links: RecipeIngredient[];
};

export type CursorPage<T> = {
  items: T[];
  total: number;
  page_size: number;
  next_cursor: string | null;
};

export type RecipePage = CursorPage<RecipeListItem>;
export type IngredientPage = CursorPage<Ingredient>;

export type RecipeWrite = {
  title: string;
  description: string;
  tag_ids: number[];
  ingredients: { ingredient_id: number; quantity: number; unit: string }[];
};
