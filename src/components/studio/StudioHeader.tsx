import { useNavigate } from "react-router-dom";

interface StudioHeaderProps {
  itemCount: number;
  onClear: () => void;
  onSubmit: () => void;
}

export function StudioHeader({ itemCount, onClear, onSubmit }: StudioHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 font-body text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Back</span>
      </button>

      <h1 className="font-display text-lg sm:text-2xl font-semibold text-foreground">
        Jewelry Studio
      </h1>

      <div className="flex gap-2">
        {itemCount > 0 && (
          <button
            onClick={onClear}
            className="rounded-lg border border-border px-2 py-1.5 font-body text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Clear
          </button>
        )}
        <button
          onClick={onSubmit}
          disabled={itemCount === 0}
          className="rounded-full px-4 py-1.5 font-body text-xs sm:text-sm font-semibold text-primary-foreground shadow-lg transition-all disabled:opacity-40"
          style={{
            background:
              itemCount > 0
                ? "linear-gradient(135deg, #D6A07A, #D64A86, #C73A78)"
                : "hsl(var(--muted))",
          }}
        >
          Submit
        </button>
      </div>
    </header>
  );
}
