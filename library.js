const fallbackGames = [
  { title: "A Day In Space", release_year: "1987", platform_name: "Arcade", genre_category: "Shooter" },
  { title: "Amazing Maze", release_year: "1976", platform_name: "Arcade", genre_category: "Action" },
  { title: "Astro Chase", release_year: "1982", platform_name: "Arcade", genre_category: "Shooter" },
  { title: "Boulder Dash", release_year: "1985", platform_name: "Arcade", genre_category: "Action" },
  { title: "Bristles", release_year: "1983", platform_name: "Arcade", genre_category: "Platformer" },
  { title: "Columns III (Mega Play)", release_year: "1993", platform_name: "Arcade", genre_category: "Puzzle" },
  { title: "Flip and Flop", release_year: "1983", platform_name: "Arcade", genre_category: "Platformer" },
  { title: "Golden Axe II (mega-tech)", release_year: "1991", platform_name: "Arcade", genre_category: "Beat 'em up" },
  { title: "Grand Slam", release_year: "1983", platform_name: "Arcade", genre_category: "Sports" },
  { title: "Pac-Man", release_year: "1980", platform_name: "Arcade", genre_category: "Action" },
  { title: "Space Invaders", release_year: "1978", platform_name: "Arcade", genre_category: "Shooter" },
  { title: "Street Fighter II", release_year: "1991", platform_name: "Arcade", genre_category: "Fighting" },
];
const colors = [["#45307d", "#dd5072"], ["#e07c3d", "#f4bf48"], ["#164078", "#43b7c4"], ["#19564e", "#b3cf61"]];
let games = fallbackGames;
let activeFilter = new URLSearchParams(window.location.search).get("category") || "all";
let currentPage = 1;
const pageSize = 12;
const leftGrid = document.querySelector("#game-grid-left");
const rightGrid = document.querySelector("#game-grid-right");
const status = document.querySelector("#aisle-status");
const search = document.querySelector("#library-search");

function filteredGames() {
  const term = search.value.trim().toLowerCase();
  return games.filter((game) => {
    const filterMatch = activeFilter === "all"
      || String(game.platform_name).toLowerCase() === activeFilter.toLowerCase()
      || String(game.genre_category).toLowerCase() === activeFilter.toLowerCase()
      || String(game.decade).toLowerCase() === activeFilter.toLowerCase()
      || String(game.release_year).startsWith(activeFilter.slice(0, 4));
    return filterMatch && (!term || [game.title, game.platform_name, game.genre_category, game.release_year]
      .some((value) => String(value || "").toLowerCase().includes(term)));
  }).sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
}

function render() {
  const matching = filteredGames();
  const pages = Math.max(1, Math.ceil(matching.length / pageSize));
  currentPage = Math.min(currentPage, pages);
  const visible = matching.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  status.textContent = `${matching.length} ${matching.length === 1 ? "game" : "games"} on this shelf`;
  const books = visible.filter((game) => game.title);
  const renderBook = (game, index) => {
    const [dark, light] = colors[index % colors.length];
    return `<a class="game-card" href="#game-${encodeURIComponent(game.title)}">
      <span class="book-genre">${escapeHtml(game.genre_category || "Genre Not Available")}</span>
      <div class="game-cover" style="--card-dark:${dark};--card-light:${light}" role="img" aria-label="${escapeHtml(game.title)} cover">
        <span>${escapeHtml(game.title)}</span>
      </div>
      <h3>${escapeHtml(game.title)}</h3>
      <p>${escapeHtml(game.release_year || "Not Available")} · ${escapeHtml(game.platform_name || "Not Available")}</p>
    </a>`;
  };
  leftGrid.innerHTML = books.slice(0, 6).map(renderBook).join("");
  rightGrid.innerHTML = books.slice(6, 12).map((game, index) => renderBook(game, index + 6)).join("");
  if (!books.length) {
    leftGrid.innerHTML = `<p class="empty-library">No games found in this category.</p>`;
  }
  document.querySelector("#pagination").innerHTML = `
    <button type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
    <span>Page ${currentPage} of ${pages}</span>
    <button type="button" data-page="${currentPage + 1}" ${currentPage === pages ? "disabled" : ""}>Next</button>`;
  document.querySelectorAll("#pagination button").forEach((button) => button.addEventListener("click", () => {
    currentPage = Number(button.dataset.page); render(); window.scrollTo({ top: 500, behavior: "smooth" });
  }));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}

document.querySelectorAll(".shelf-tab").forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter; currentPage = 1;
  document.querySelectorAll(".shelf-tab").forEach((tab) => tab.classList.toggle("is-active", tab === button));
  render();
}));
search.addEventListener("input", () => { currentPage = 1; render(); });
render();

fetch("00/games_master_dataset.csv")
  .then((response) => {
    if (!response.ok) throw new Error(`Dataset request failed: ${response.status}`);
    return response.text();
  })
  .then((csv) => {
    const lines = parseCsvRecords(csv);
    if (lines.length < 2) return;
    const headers = parseCsvLine(lines[0]);
    games = [...fallbackGames, ...lines.slice(1).map((line) => {
      const values = parseCsvLine(line);
      return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
    })];
    render();
  })
  .catch(() => render());

function parseCsvLine(line) {
  const values = []; let value = ""; let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { value += '"'; index += 1; } else quoted = !quoted;
    } else if (character === "," && !quoted) { values.push(value); value = ""; } else value += character;
  }

  function parseCsvRecords(csv) {
    const records = [];
    let record = "";
    let quoted = false;
    for (let index = 0; index < csv.length; index += 1) {
      const character = csv[index];
      if (character === '"') quoted = !quoted;
      if (character === "\n" && !quoted) {
        if (record.trim()) records.push(record.replace(/\r$/, ""));
        record = "";
      } else {
        record += character;
      }
    }
    if (record.trim()) records.push(record.replace(/\r$/, ""));
    return records;
  }
  values.push(value); return values;
}
