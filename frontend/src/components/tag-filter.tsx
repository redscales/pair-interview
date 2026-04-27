import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useTagFilter } from "@/lib/filter-store";
import type { Tag } from "@/lib/types";

const ALL = "__all__";

export function TagFilter() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selected, setSelected] = useTagFilter();

  useEffect(() => {
    api.listTags().then(setTags).catch(console.error);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm">Tag:</Label>
      <Select
        value={selected ?? ALL}
        onValueChange={(v) => setSelected(v === ALL ? null : v)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All tags</SelectItem>
          {tags.map((t) => (
            <SelectItem key={t.id} value={t.name}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
