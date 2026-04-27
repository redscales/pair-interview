import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function Pagination({
  currentPage,
  totalPages,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="flex items-center justify-end gap-2 mt-4">
      <Button variant="outline" disabled={!canPrev} onClick={onPrev}>
        Previous
      </Button>
      <span className="self-center text-sm">
        Page {currentPage} / {totalPages}
      </span>
      <Button variant="outline" disabled={!canNext} onClick={onNext}>
        Next
      </Button>
    </div>
  );
}
