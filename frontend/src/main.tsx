import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import "./index.css";
import RootLayout from "./routes/root-layout";
import RecipesListPage from "./routes/recipes-list";
import RecipeDetailPage from "./routes/recipe-detail";
import RecipeFormPage from "./routes/recipe-form";
import IngredientsListPage from "./routes/ingredients-list";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, element: <Navigate to="/recipes" replace /> },
      { path: "recipes", Component: RecipesListPage },
      { path: "recipes/new", Component: RecipeFormPage },
      { path: "recipes/:id", Component: RecipeDetailPage },
      { path: "recipes/:id/edit", Component: RecipeFormPage },
      { path: "ingredients", Component: IngredientsListPage },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
