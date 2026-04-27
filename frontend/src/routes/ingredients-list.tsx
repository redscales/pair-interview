import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/pagination";
import { TagFilter } from "@/components/tag-filter";
import { api } from "@/lib/api";
import { useTagFilter } from "@/lib/filter-store";
import type { IngredientPage } from "@/lib/types";

const PAGE_SIZE = 20;

export default function IngredientsListPage() {
  const [tag] = useTagFilter();
  const [data, setData] = useState<IngredientPage | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [stack, setStack] = useState<(string | null)[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    api
      .listIngredients({ cursor, page_size: PAGE_SIZE, tag })
      .then(setData)
      .catch((e) => setError(String(e)));
  }, [cursor, tag]);

  useEffect(() => {
    setCursor(null);
    setStack([]);
  }, [tag]);

  const onNext = () => {
    if (!data?.next_cursor) return;
    setStack((s) => [...s, cursor]);
    setCursor(data.next_cursor);
  };
  const onPrev = () => {
    setStack((s) => {
      const next = [...s];
      const prev = next.pop() ?? null;
      setCursor(prev);
      return next;
    });
  };

  const currentPage = stack.length + 1;
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
                <span className="text-muted-foreground text-xs w-12">#{ing.id}</span>
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        canPrev={stack.length > 0}
        canNext={!!data?.next_cursor}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}
