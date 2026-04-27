import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/pagination";
import { TagFilter } from "@/components/tag-filter";
import { api } from "@/lib/api";
import { useTagFilter } from "@/lib/filter-store";
import type { CursorPage, RecipeListItem } from "@/lib/types";

const PAGE_SIZE = 20;

export default function RecipesListPage() {
  const [tag] = useTagFilter();
  const [page, setPage] = useState<CursorPage<RecipeListItem> | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const [stack, setStack] = useState<(number | null)[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    api
      .listRecipes({ cursor, page_size: PAGE_SIZE, tag })
      .then(setPage)
      .catch((e) => setError(String(e)));
  }, [cursor, tag]);

  // When the tag changes, reset pagination.
  useEffect(() => {
    setCursor(null);
    setStack([]);
  }, [tag]);

  const onNext = () => {
    if (!page?.next_cursor) return;
    setStack((s) => [...s, cursor]);
    setCursor(page.next_cursor);
  };
  const onPrev = () => {
    setStack((s) => {
      const next = [...s];
      const prev = next.pop() ?? null;
      setCursor(prev);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Link to="/recipes/new">
          <Button>New recipe</Button>
        </Link>
      </div>
      <TagFilter />
      {error && <div className="text-destructive">{error}</div>}
      <div className="grid gap-2">
        {page?.items.map((r) => (
          <Link key={r.id} to={`/recipes/${r.id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardContent className="py-3 flex items-center gap-3">
                <span className="text-muted-foreground text-xs w-12">#{r.id}</span>
                <span className="font-medium flex-1">{r.title}</span>
                <span className="flex flex-wrap gap-1">
                  {r.tags.map((t) => (
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
      <Pagination
        canPrev={stack.length > 0}
        canNext={!!page?.next_cursor}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}
