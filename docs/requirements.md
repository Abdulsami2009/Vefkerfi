# Purpose
Players who want to discover classic games but need help knowing where to start.
## Primary user
Anyone but espically old people
## Problem
getting people to use the website
## Out of scope

## Functional requirements
1. FR-01: The user can select a category such as genre, platform, or decade and view the games assigned to it.
2. FR-02: The user can browse the collection through organized library sections.
3. FR-03: The front desk is the initial page shown when the user opens the website.
4. FR-04: The user can search for a game by entering part or all of its title.
5. FR-05: The user can open a details page for a selected game.
## Non-functional requirements
1. NFR-01: The system should be able to work on different screen sizes. fx: mobile, laptop.
2. NFR-02: The system response has to be fast.
3. NFR-03: Should be able to access from different devices.
## User stories
1. US-01: As a classic game fan I want to select a category so that I can find games that interest me without having to know their names.

PASS/FAIL: User can select a category and view all games in that category.
PASS/FAIL: Games display 12 per page, sorted alphabetically by title, with thumbnail and title shown.
PASS/FAIL: If category has no games, message displays: "No games found in this category."
PASS/FAIL: User can navigate between pages using Previous/Next buttons.
PASS/FAIL: User can select a game from the category to view its details.

2. US-02: As a classic game fan I want to search for a game by name so that I can find it quickly without having to explore the aisles.

PASS/FAIL: User can enter a game name and search (case-insensitive, partial match).
PASS/FAIL: Search results display max 20 per page, sorted alphabetically, showing thumbnail, title, and release year.
PASS/FAIL: If no results, display: "No results found for [search].

3. US-03: As a classic game fan, I want to see the details of a game so that I can decide whether it is something I want to explore further, even when some information is missing.

PASS/FAIL: User can select a game and view its details page.
PASS/FAIL: Page displays: Title, Release Year, Developer, Genre, Platform(s), Image, Description, and Rating.
PASS/FAIL: Missing data shows "Not Available", Missing images show placeholder "No image available".
PASS/FAIL: "Back" button returns to previous page.
## Open questions
1. Do we support an account or not?
2. is the website able to be accessed from a phone.
3. Do we have an age restriction.

# Issues
1. Title: Start in the front desk
Related: FR-03, US-02
Acceptence criteria:
Opening the website displays the front desk.
The front desk contains a search field.
The front desk contains a Browse Categories button.
Search opens the search experience.
Browse Categories opens the library view.

Owner: Abdul Sami
size: L

2. Title: The details of games
Related: US-03, FR-05
Acceptence criteria:
The details page displays title, release year, developer, genre, platform, image, description, and rating.
Missing fields display “Not Available.”
Missing images display “No image available.”
The Back button returns to the previous page.
Owner: Eigmantas
Size: S

3. Tile: The Library
Related: FR-02, US-01
Acceptence criteria: The aisles would have games by categories so that the user can explore through it
Owner: Eigmantas
Size: S

4. Title: The search bar
Related: FR-04
Acceptence criteria:
Users can enter a search term.
Search ignores letter casing.
Partial title matches are returned.
Results are sorted alphabetically.
Owner: Abdul Sami
Size: S

5. Title: Recommendation inside details
Related: US-03
Acceptence criteria: When you press to see the detail of a game there should be a recommendation list which would have fimilar games
Owner: Eigmantas
Size: S

6. Title: The serach bar info
Related: FR-04
Acceptence criteria: IF the user searches and the data is not there it should show a message that the game is not available
Owner: Abdul Sami
Size: S

7. Title: details missing
Related: US-03 
Description: Ensure the details page displays gracefully even when some fields are missing from the data source. Acceptance criteria: Missing data fields show "Not Available".
Owner: Abdul Sami
Size: M

8. Title: Support responsive layouts
Description:Ensure the website works on supported desktop, laptop, tablet, and mobile screen sizes.

Acceptance criteria:

The front desk is usable at each supported screen size.
Search and category results remain readable without horizontal scrolling.
Details pages remain usable without overlapping content.
Buttons and search fields remain accessible on touch screens.

## Traceability
| User story | Issues |
|------------|--------|
| US-01      | #2, #3, #5 |
| US-02      | #4, #6 |
| US-03      | #5 |

## Review notes
Suggestion we accepted:
THe acceptence criteria needed to be more precice and detailed

Suggestion we rejected:
We didnt really reject anything because everything it suggested was helpful and useful
...
Why:

Why we accepted: It was useful to us to organize out project

why we rejected: We didnt reject anything
...