import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TagFilter } from "@/components/tag-filter";
import { api } from "@/lib/api";
import { useTagFilter } from "@/lib/filter-store";
import type { IngredientPage } from "@/lib/types";

const PAGE_SIZE = 20;

export default function IngredientsListPage() {
  const [tag] = useTagFilter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<IngredientPage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    api
      .listIngredients({ page, page_size: PAGE_SIZE, tag })
      .then(setData)
      .catch((e) => setError(String(e)));
  }, [page, tag]);

  // Reset to page 1 when tag changes.
  useEffect(() => setPage(1), [tag]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Ingredients</h1>
      <TagFilter />
      {error && <div className="text-destructive">{error}</div>}
      <div className="text-sm text-muted-foreground">
        {data ? `${data.total} total` : "Loading…"}
      </div>
      <div className="grid gap-2">
        {data?.items.map((ing) => (
          <Link key={ing.id} to={`/ingredients/${ing.id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardContent className="py-3 flex items-center gap-3">
                <span className="font-medium flex-1">{ing.name}</span>
                <span className="flex flex-wrap gap-1">
                  {ing.tags.map((t) => (
                    <Badge key={t.id} variant="secondary">
                      {t.name}
                    </Badge>
                  ))}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <span className="self-center text-sm">
          Page {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
