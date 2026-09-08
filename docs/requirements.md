# Purpose
Players who want to discover classic games but need help knowing where to start.
## Primary user
Anyone but espically old people
## Problem
getting people to use the website
## Out of scope

## Functional requirements
FR-01: The user can select by categories
FR-02: The user can explore through aisles of games like a library
FR-03: The system display starts with the front desk which from there the user can explore.
FR-04: The user should have a search bar if they dont want to explore.
FR-05: The user should be able to see each detail of the game even if it doesnt have that data.
## Non-functional requirements
NFR-01: The system should be able to work on different screen sizes. fx: mobile, laptop.
NFR-02: The system response has to be fast.
NFR-03: Should be able to access from different devices.
## User stories
US-01: As a classic game fan I want to select a category so that I can find games that interest me without having to know their names.

PASS/FAIL: User can select a category and view all games in that category.
PASS/FAIL: Games display 12 per page, sorted alphabetically by title, with thumbnail and title shown.
PASS/FAIL: If category has no games, message displays: "No games found in this category."
PASS/FAIL: User can navigate between pages using Previous/Next buttons.
PASS/FAIL: User can select a game from the category to view its details.

US-02: As a classic game fan I want to search for a game by name so that I can find it quickly without having to explore the aisles.

PASS/FAIL: User can enter a game name and search (case-insensitive, partial match).
PASS/FAIL: Search results display max 20 per page, sorted alphabetically, showing thumbnail, title, and release year.
PASS/FAIL: If no results, display: "No results found for [search].

US-03: As a classic game fan, I want to see the details of a game so that I can decide whether it is something I want to explore further, even when some information is missing.

PASS/FAIL: User can select a game and view its details page.
PASS/FAIL: Page displays: Title, Release Year, Developer, Genre, Platform(s), Image, Description, and Rating.
PASS/FAIL: Missing data shows "Not Available", Missing images show placeholder "No image available".
PASS/FAIL: "Back" button returns to previous page.
## Open questions