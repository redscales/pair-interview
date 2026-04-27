import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import type { Ingredient, RecipeWrite, Tag } from "@/lib/types";

type IngEntry = { ingredient_id: number; quantity: number; unit: string };

export default function RecipeFormPage() {
  const { id } = useParams();
  const editing = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagIds, setTagIds] = useState<Set<number>>(new Set());
  const [ingredients, setIngredients] = useState<IngEntry[]>([]);

  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listTags().then(setAllTags);
    // Get a generous slice for the picker; not paginated for simplicity.
    api
      .listIngredients({ page: 1, page_size: 500, tag: null })
      .then((p) => setAllIngredients(p.items));
  }, []);

  useEffect(() => {
    if (!editing || !id) return;
    api.getRecipe(Number(id)).then((r) => {
      setTitle(r.title);
      setDescription(r.description);
      setTagIds(new Set(r.tags.map((t) => t.id)));
      setIngredients(
        r.ingredient_links.map((l) => ({
          ingredient_id: l.ingredient.id,
          quantity: l.quantity,
          unit: l.unit,
        })),
      );
    });
  }, [editing, id]);

  const toggleTag = (tagId: number) => {
    setTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
  };

  const onAddIngredient = () => {
    if (allIngredients.length === 0) return;
    setIngredients((prev) => [
      ...prev,
      { ingredient_id: allIngredients[0].id, quantity: 1, unit: "g" },
    ]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const body: RecipeWrite = {
      title,
      description,
      tag_ids: [...tagIds],
      ingredients,
    };
    try {
      const saved = editing
        ? await api.updateRecipe(Number(id), body)
        : await api.createRecipe(body);
      navigate(`/recipes/${saved.id}`);
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">{editing ? "Edit recipe" : "New recipe"}</h1>
      {error && <div className="text-destructive">{error}</div>}

      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTag(t.id)}
              className={`px-2 py-1 rounded-md border text-sm ${
                tagIds.has(t.id) ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label>Ingredients</Label>
          <Button type="button" variant="outline" onClick={onAddIngredient}>
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <select
                className="border rounded-md px-2 flex-1 bg-background"
                value={ing.ingredient_id}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setIngredients((prev) =>
                    prev.map((x, j) => (i === j ? { ...x, ingredient_id: v } : x)),
                  );
                }}
              >
                {allIngredients.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                step="0.01"
                value={ing.quantity}
                onChange={(e) =>
                  setIngredients((prev) =>
                    prev.map((x, j) =>
                      i === j ? { ...x, quantity: Number(e.target.value) } : x,
                    ),
                  )
                }
                className="w-24"
              />
              <Input
                value={ing.unit}
                onChange={(e) =>
                  setIngredients((prev) =>
                    prev.map((x, j) => (i === j ? { ...x, unit: e.target.value } : x)),
                  )
                }
                className="w-24"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setIngredients((prev) => prev.filter((_, j) => j !== i))
                }
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
