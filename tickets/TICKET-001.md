# TICKET-001: Ingredients page shows the wrong items after browsing recipes

**Reporter:** Maya Chen
**Reported:** 2026-04-22
**Severity:** Medium

## Description
After I narrow the recipes view down to one type of food, the Ingredients page suddenly shows almost nothing — like most of my pantry has disappeared. If I open the Ingredients page on its own it looks fine, so it only seems to happen after I've been browsing recipes.

## Steps to Reproduce
1. Open the app and click **Recipes** in the top menu.
2. Note how many recipes are listed (it should be a couple dozen on the first page).
3. In the **Tag** dropdown above the list, choose any tag (for example, `italian`).
4. The recipes list shrinks to just italian-tagged recipes — that part is expected.
5. Now click **Ingredients** in the top menu.

## Expected Behavior
The Ingredients page should show the full list of ingredients I'd see if I opened it directly.

## Actual Behavior
The ingredients list is much shorter than it should be — only a handful of items, sometimes none, depending on which tag I picked. Refreshing the page restores the full list, but only until I go back to recipes and pick a tag again.
