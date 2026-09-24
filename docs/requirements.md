# Requirements: Classic Games Discovery

## Purpose

Give people a simple starting point for discovering classic games through
browsing or direct title search.

## Scope

### In scope

- Front desk/home page
- Category browsing
- Title search
- Paginated results
- Game details pages
- Similar-game recommendations
- Responsive layouts and empty-state handling

### Out of scope

- Accounts, favorites, and personalized collections
- Purchasing, downloading, or launching games
- User-submitted ratings or reviews
- Age verification
- Admin tools
- Native mobile applications

## Functional requirements

### Front desk

- **FR-01:** The front desk MUST be the initial page.
- **FR-02:** It MUST include a search field and search action.
- **FR-03:** It MUST include a **Browse Categories** action.
- **FR-04:** Submitting a search MUST open results for the entered term.
- **FR-05:** **Browse Categories** MUST open the library view.

### Library and categories

- **FR-06:** The library MUST provide available categories, such as genre,
  platform, and release decade.
- **FR-07:** Selecting a category MUST show its games.
- **FR-08:** Category results MUST show 12 games per page, alphabetically by
  title.
- **FR-09:** Category cards MUST show a thumbnail and title.
- **FR-10:** Users MUST be able to navigate pages with **Previous** and **Next**.
- **FR-11:** An empty category MUST show `No games found in this category.`

### Search

- **FR-12:** Users MUST be able to search all or part of a game title.
- **FR-13:** Matching MUST be case-insensitive and results alphabetized.
- **FR-14:** Search results MUST show no more than 20 games per page.
- **FR-15:** Search cards MUST show a thumbnail, title, and release year.
- **FR-16:** No matches MUST show `No results found for "<search term>".`
- **FR-17:** Selecting a result MUST open its details page.

### Game details

- **FR-18:** The details page MUST show title, release year, developer, genre,
  platform(s), image, description, and rating when available.
- **FR-19:** Missing fields MUST show `Not Available`.
- **FR-20:** A missing image MUST show `No image available`.
- **FR-21:** A **Back** action MUST return to the previous view.
- **FR-22:** Similar games SHOULD be shown when recommendations are available.

## Non-functional requirements

- **NFR-01:** All views MUST work on supported desktop, laptop, tablet, and
  mobile sizes without horizontal scrolling.
- **NFR-02:** Controls MUST be usable by touch and have accessible names and
  visible keyboard focus states.
- **NFR-03:** Missing optional data MUST NOT cause overlapping or clipped content.
- **NFR-04:** Navigation and search SHOULD show a loading state immediately and
  return results within 2 seconds under normal test conditions.

## User stories and acceptance criteria

### US-01: Start at the front desk

As a visitor, I want a clear starting page so that I can browse or search.

- Opening the website displays the front desk.
- Search submits to the results view.
- **Browse Categories** opens the library.

### US-02: Browse by category

As a fan, I want categories so that I can find games without knowing their
names.

- Available categories are displayed.
- Selecting one shows its games, 12 per page, alphabetically.
- Cards show a thumbnail and title.
- **Previous** and **Next** navigate valid pages only.
- Empty categories show `No games found in this category.`
- Selecting a game opens its details.

### US-03: Search by title

As a fan, I want to search by title so that I can find a game quickly.

- Full and partial, case-insensitive matches are returned alphabetically.
- Results show no more than 20 games per page.
- Cards show a thumbnail, title, and release year.
- No matches show `No results found for "<search term>".`
- Selecting a result opens its details.

### US-04: View details

As a fan, I want game details so that I can decide whether to explore further.

- Available title, year, developer, genre, platform(s), image, description, and
  rating are displayed.
- Missing fields and images use the specified placeholders.
- **Back** returns to the previous view.
- Similar games appear when available.

### US-05: Use different devices

As a visitor, I want the site to work on my device.

- All views remain usable and readable at supported screen sizes.
- Touch controls remain accessible.
- Details pages do not overlap or clip content.
- Keyboard focus is visible.

## Data and errors

- Empty results MUST show the specified empty-state message.
- Missing optional fields MUST use the specified placeholders.
- Data-loading failures MUST show a clear error and a retry or return action.

## Open decisions

1. Which exact categories and values will be supported?
2. What is the game-data source and schema?
3. How will similar games be selected?
4. Which browsers and minimum viewport sizes are supported?
5. Are age notices needed?
6. Should accounts or saved games be added later?

## Delivery issues

| Issue | Title | Requirements | Owner | Size |
|---|---|---|---|---|
| #1 | Start at the front desk | FR-01–FR-05, US-01 | Abdul Sami | L |
| #2 | Game details page | FR-18–FR-21, US-04 | Eigmantas | S |
| #3 | Build the library | FR-06–FR-11, US-02 | Eigmantas | S |
| #4 | Implement title search | FR-12–FR-17, US-03 | Abdul Sami | S |
| #5 | Similar-game recommendations | FR-22, US-04 | Eigmantas | S |
| #6 | Empty search results | FR-16, US-03 | Abdul Sami | S |
| #7 | Missing game details | FR-19–FR-20, US-04 | Abdul Sami | M |
| #8 | Responsive layouts | NFR-01–NFR-03, US-05 | TBD | TBD |

## Traceability

| User story | Requirements | Issues |
|---|---|---|
| US-01 | FR-01–FR-05 | #1 |
| US-02 | FR-06–FR-11 | #3 |
| US-03 | FR-12–FR-17 | #4, #6 |
| US-04 | FR-18–FR-22 | #2, #5, #7 |
| US-05 | NFR-01–NFR-03 | #8 |

## Review notes

Acceptance criteria were made more precise and testable. No suggestions were
recorded as rejected.
