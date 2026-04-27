import { NavLink } from "react-router";

export function SiteNav() {
  const link =
    "px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground";
  const active = "bg-accent text-accent-foreground";
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-2">
        <span className="font-semibold mr-4">Recipe Library</span>
        <NavLink to="/recipes" className={({ isActive }: { isActive: boolean }) => `${link} ${isActive ? active : ""}`}>
          Recipes
        </NavLink>
        <NavLink to="/ingredients" className={({ isActive }: { isActive: boolean }) => `${link} ${isActive ? active : ""}`}>
          Ingredients
        </NavLink>
      </div>
    </nav>
  );
}
