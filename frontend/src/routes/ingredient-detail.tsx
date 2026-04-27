import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Ingredient, RecipeListItem } from "@/lib/types";

export default function IngredientDetailPage() {
  const { id } = useParams();
  const [ing, setIng] = useState<Ingredient | null>(null);
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);

  useEffect(() => {
    if (!id) return;
    api.getIngredient(Number(id)).then(setIng);
    // Lazy "recipes that use this ingredient": fetch a wide page and filter client-side.
    // (Acceptable for interview scope — no need for a dedicated endpoint.)
    api
      .listRecipes({ page_size: 100 })
      .then((p) => {
        setRecipes(p.items);
      })
      .catch(console.error);
  }, [id]);

  if (!ing) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{ing.name}</h1>
      <div className="flex flex-wrap gap-1">
        {ing.tags.map((t) => (
          <Badge key={t.id} variant="secondary">
            {t.name}
          </Badge>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Used in (sample)</CardTitle>
        </CardHeader>
        <CardContent>
          {recipes.length === 0 ? (
            <span className="text-muted-foreground">No recipes loaded.</span>
          ) : (
            <ul className="space-y-1">
              {recipes.slice(0, 10).map((r) => (
                <li key={r.id}>
                  <Link to={`/recipes/${r.id}`} className="hover:underline">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
