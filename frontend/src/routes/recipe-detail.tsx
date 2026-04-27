import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { RecipeDetail } from "@/lib/types";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getRecipe(Number(id)).then(setRecipe).catch((e) => setError(String(e)));
  }, [id]);

  if (error) return <div className="text-destructive">{error}</div>;
  if (!recipe) return <div>Loading…</div>;

  const onDelete = async () => {
    if (!confirm(`Delete "${recipe.title}"?`)) return;
    await api.deleteRecipe(recipe.id);
    navigate("/recipes");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{recipe.title}</h1>
        <div className="flex gap-2">
          <Link to={`/recipes/${recipe.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {recipe.tags.map((t) => (
          <Badge key={t.id} variant="secondary">
            {t.name}
          </Badge>
        ))}
      </div>
      <p className="text-muted-foreground">{recipe.description}</p>
      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {recipe.ingredient_links.map((link) => (
              <li key={link.ingredient.id} className="flex justify-between">
                <span>
                  <Link
                    to={`/ingredients/${link.ingredient.id}`}
                    className="hover:underline"
                  >
                    {link.ingredient.name}
                  </Link>
                </span>
                <span className="text-muted-foreground">
                  {link.quantity} {link.unit}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
