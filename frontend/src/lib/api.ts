import type {
  Ingredient,
  IngredientPage,
  RecipeDetail,
  RecipePage,
  RecipeWrite,
  Tag,
} from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

type PageParams = { cursor?: string | null; page_size?: number; tag?: string | null };

function pageQuery(params: PageParams): string {
  const q = new URLSearchParams();
  if (params.cursor) q.set("cursor", params.cursor);
  if (params.page_size != null) q.set("page_size", String(params.page_size));
  if (params.tag) q.set("tag", params.tag);
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  listTags: () => request<Tag[]>("/api/tags"),

  listRecipes: (params: PageParams) =>
    request<RecipePage>(`/api/recipes${pageQuery(params)}`),

  getRecipe: (id: number) => request<RecipeDetail>(`/api/recipes/${id}`),
  createRecipe: (body: RecipeWrite) =>
    request<RecipeDetail>("/api/recipes", { method: "POST", body: JSON.stringify(body) }),
  updateRecipe: (id: number, body: RecipeWrite) =>
    request<RecipeDetail>(`/api/recipes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteRecipe: (id: number) =>
    request<void>(`/api/recipes/${id}`, { method: "DELETE" }),

  listIngredients: (params: PageParams) =>
    request<IngredientPage>(`/api/ingredients${pageQuery(params)}`),

  getIngredient: (id: number) => request<Ingredient>(`/api/ingredients/${id}`),
};
