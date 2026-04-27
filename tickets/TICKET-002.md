# TICKET-002: Same recipe shows up on two pages when paging through the list

**Reporter:** Diego Santos
**Reported:** 2026-04-23
**Severity:** Low

## Description
When I'm browsing the recipes list and I click **Next** to go to the next page, I keep seeing the same recipe twice — once at the bottom of the page I just left, and again at the top of the new page. It happens at every page break, not just one.

## Steps to Reproduce
1. Open the app and click **Recipes** in the top menu.
2. Make sure no tag is selected (the dropdown should say "All tags").
3. Scroll to the bottom of the first page and note the title of the **last** recipe shown.
4. Click **Next**.
5. Look at the **first** recipe on the new page.

## Expected Behavior
The first recipe on page 2 should be different from the last recipe on page 1 — every recipe should appear on exactly one page.

## Actual Behavior
The recipe at the bottom of page 1 reappears at the top of page 2, so it's listed twice in a row. Clicking **Next** again has the same problem at every page boundary.
