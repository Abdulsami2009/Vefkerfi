const fallbackGames = [
  { title: "Amazing Maze", release_year: "1976", platform_name: "Arcade", genre_category: "Action" },
  { title: "Astro Chase", release_year: "1982", platform_name: "Arcade", genre_category: "Shooter" },
  { title: "Boulder Dash", release_year: "1985", platform_name: "Arcade", genre_category: "Action" },
  { title: "Golden Axe II (mega-tech)", release_year: "1991", platform_name: "Arcade", genre_category: "Beat 'em up" },
];

const results = document.querySelector("#search-results");
const searchInput = document.querySelector("#game-search");
const searchForm = document.querySelector("#search-form");
let games = fallbackGames;

function renderResults(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    results.innerHTML = "";
    return;
  }

  const matches = games
    .filter((game) => [game.title, game.platform_name, game.genre_category, game.release_year]
      .some((value) => String(value || "").toLowerCase().includes(normalized)))
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, 20);

  results.innerHTML = matches.length
    ? matches.map((game) => `
      <a class="search-result" href="#showcase">
        <strong>${escapeHtml(game.title)}</strong>
        <small>${escapeHtml(game.release_year || "Not Available")} · ${escapeHtml(game.platform_name || "Not Available")}</small>
        <span aria-hidden="true">↗</span>
      </a>`).join("")
    : `<p class="search-empty">No results found for "${escapeHtml(query.trim())}".</p>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResults(searchInput.value);
  results.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    searchInput.value = card.dataset.query;
    renderResults(card.dataset.query);
  });
});

fetch("00/games_master_dataset.csv")
  .then((response) => {
    if (!response.ok) throw new Error(`Dataset request failed: ${response.status}`);
    return response.text();
  })
  .then((csv) => {
    const lines = csv.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return;
    const headers = parseCsvLine(lines[0]);
    const datasetGames = lines.slice(1).map((line) => {
      const values = parseCsvLine(line);
      return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
    });
    games = [...fallbackGames, ...datasetGames];
  })
  .catch(() => {
    // The embedded sample keeps the page useful when opened directly as a file.
  });

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { value += '"'; index += 1; }
      else quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(value); value = "";
    } else value += character;
  }
  values.push(value);
  return values;
}
