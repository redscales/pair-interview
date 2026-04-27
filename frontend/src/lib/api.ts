import type {
  CursorPage,
  Ingredient,
  IngredientPage,
  RecipeDetail,
  RecipeListItem,
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

export const api = {
  listTags: () => request<Tag[]>("/api/tags"),

  listRecipes: (params: { cursor?: number | null; page_size?: number; tag?: string | null }) => {
    const q = new URLSearchParams();
    if (params.cursor != null) q.set("cursor", String(params.cursor));
    if (params.page_size != null) q.set("page_size", String(params.page_size));
    if (params.tag) q.set("tag", params.tag);
    const qs = q.toString();
    return request<CursorPage<RecipeListItem>>(`/api/recipes${qs ? `?${qs}` : ""}`);
  },

  getRecipe: (id: number) => request<RecipeDetail>(`/api/recipes/${id}`),
  createRecipe: (body: RecipeWrite) =>
    request<RecipeDetail>("/api/recipes", { method: "POST", body: JSON.stringify(body) }),
  updateRecipe: (id: number, body: RecipeWrite) =>
    request<RecipeDetail>(`/api/recipes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteRecipe: (id: number) =>
    request<void>(`/api/recipes/${id}`, { method: "DELETE" }),

  listIngredients: (params: { page?: number; page_size?: number; tag?: string | null }) => {
    const q = new URLSearchParams();
    if (params.page != null) q.set("page", String(params.page));
    if (params.page_size != null) q.set("page_size", String(params.page_size));
    if (params.tag) q.set("tag", params.tag);
    const qs = q.toString();
    return request<IngredientPage>(`/api/ingredients${qs ? `?${qs}` : ""}`);
  },

  getIngredient: (id: number) => request<Ingredient>(`/api/ingredients/${id}`),
};
