const app = document.getElementById("app");
const DATA_URL = "00/games_master_dataset.json";
const CATEGORY_PAGE_SIZE = 12;
const SEARCH_PAGE_SIZE = 20;
let games = [];
let dataError = null;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const character = text[i], next = text[i + 1];
    if (character === '"' && quoted && next === '"') { field += '"'; i += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) { row.push(field); field = ""; }
    else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") i += 1;
      row.push(field); if (row.some(value => value.trim())) rows.push(row);
      row = []; field = "";
    } else field += character;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift().map(header => header.replace(/^\uFEFF/, "").trim());
  return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
}

async function loadGames() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Unable to load game data (${response.status})`);
  const text = await response.text();
  const loaded = parseCsv(text);
  if (!loaded.length) throw new Error("The game dataset is empty.");
  return loaded;
}

function value(game, field) {
  const result = game[field];
  return result && result !== "null" && result !== "undefined" ? result : "";
}
function display(game, field) { return escapeHtml(value(game, field) || "Not Available"); }
function sorted(items) { return [...items].sort((a, b) => value(a, "title").localeCompare(value(b, "title"))); }
function route() { return location.hash.slice(1).split("/"); }
function navigate(path) { location.hash = path; }
function logo() { return `<a class="logo" href="#home"><i class="logo-mark" aria-hidden="true">D</i>Deep Library</a>`; }
function header() { return `<header class="site-header">${logo()}</header>`; }
function imageMarkup(game, className = "cover") {
  const path = value(game, "cover_image_path");
  return path ? `<div class="${className}"><img src="${escapeHtml(`00/${path}`)}" alt="" onerror="this.parentElement.innerHTML='<span>No image available</span>'"></div>` : `<div class="${className}"><span>No image available</span></div>`;
}
function stateMarkup(title, message, retry = true) {
  return `<div class="state" role="alert"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(message)}</p>${retry ? '<button class="btn gold" data-action="retry">Try again</button>' : ""}</div>`;
}
function gameCard(game, search = false) {
  const year = value(game, "release_year") || "Not Available";
  return `<button class="game-card" data-game="${escapeHtml(value(game, "game_id"))}" aria-label="Open details for ${escapeHtml(value(game, "title"))}">
    ${imageMarkup(game)}
    <span class="meta"><b>${display(game, "title")}</b><span>${search ? escapeHtml(year) : `${escapeHtml(value(game, "genre_category") || "Not Available")} · ${escapeHtml(year)}`}</span></span>
  </button>`;
}
function pageControls(page, totalPages, count, size, label) {
  const first = count ? page * size + 1 : 0, last = Math.min((page + 1) * size, count);
  return `<div class="controls"><button class="btn" data-page="${page - 1}" ${page === 0 ? "disabled" : ""}>← Previous</button><div class="count" aria-live="polite">${count ? `${first}–${last} of ${count}` : `0 ${label}`}</div><button class="btn" data-page="${page + 1}" ${page >= totalPages - 1 ? "disabled" : ""}>Next →</button></div>`;
}
function frontDesk() {
  app.innerHTML = `<div class="shell">${header()}<main class="front"><section><div class="eyebrow">The classic game library</div><h1>Find the game<em>you remember.</em></h1><p class="front-copy">A place for old favourites, forgotten gems, and the feeling of finding a game from your childhood again.</p><form class="search-form" id="search-form"><label for="front-search">Search for a game title</label><input id="front-search" name="query" placeholder="Search a title…" autocomplete="off"><button class="btn gold" type="submit">Search</button></form><p id="validation" class="validation" hidden>Please enter a game title to search.</p><div class="front-actions"><button class="btn gold" data-action="library">Explore the library</button></div></section><aside class="shelf-wrap" aria-label="Featured on the shelf"><div class="shelf-label">Featured on the shelf</div><div class="shelf"></div></aside></main></div>`;
  document.getElementById("search-form").addEventListener("submit", event => { event.preventDefault(); const query = new FormData(event.currentTarget).get("query").trim(); if (!query) document.getElementById("validation").hidden = false; else navigate(`search/${encodeURIComponent(query)}/0`); });
}
function categories(selectedField, selectedValue) {
  const configs = [["genre_category", "Genre", "✦"], ["platform_name", "Platform", "▣"], ["decade", "Release decade", "◷"]];
  return `<div class="category-grid">${configs.map(([field, label, icon]) => {
    const values = [...new Set(games.map(game => value(game, field)).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    return `<section class="category-panel"><div class="category-heading"><div><span class="category-icon" aria-hidden="true">${icon}</span><h2>${label}</h2></div><span class="category-total">${values.length} options</span></div><div class="category-values">${values.slice(0, 30).map(item => `<button class="category-btn${selectedField === field && selectedValue === item ? " active" : ""}" data-category="${field}" data-value="${encodeURIComponent(item)}">${escapeHtml(item)}</button>`).join("")}</div></section>`;
  }).join("")}</div>`;
}
function library() {
  const [, field = "genre_category", encoded = "", pageString = "0"] = route();
  const selected = decodeURIComponent(encoded);
  const page = Math.max(0, Number(pageString) || 0);
  const filtered = selected ? sorted(games.filter(game => value(game, field) === selected)) : [];
  const totalPages = Math.max(1, Math.ceil(filtered.length / CATEGORY_PAGE_SIZE));
  const visible = filtered.slice(page * CATEGORY_PAGE_SIZE, (page + 1) * CATEGORY_PAGE_SIZE);
  app.innerHTML = `<div class="shell">${header()}<main class="section"><div class="top-actions"><button class="btn back" data-action="home">← Back to front desk</button></div><div class="section-heading"><div class="eyebrow">The classics, opened</div><h1>Browse the collection</h1><p>Choose an aisle and rediscover a favourite.</p></div><nav class="category-bar" aria-label="Game categories">${categories(field, selected)}</nav>${selected ? `<div class="book"><div class="spread"><section class="page left"><div class="folio">${escapeHtml(selected)}</div><div class="card-grid">${visible.slice(0, 6).map(game => gameCard(game)).join("")}</div></section><div class="spine"></div><section class="page right"><div class="folio">${escapeHtml(selected)}</div><div class="card-grid">${visible.slice(6, 12).map(game => gameCard(game)).join("")}</div></section></div>${filtered.length ? pageControls(page, totalPages, filtered.length, CATEGORY_PAGE_SIZE, "games") : stateMarkup("Empty aisle", "No games found in this category.", false)}</div>` : stateMarkup("Choose an aisle", "Select a genre, platform, or release decade to begin browsing.", false)}</main></div>`;
}
function searchPage() {
  const [, encoded = "", pageString = "0"] = route(), query = decodeURIComponent(encoded), page = Math.max(0, Number(pageString) || 0);
  const matches = sorted(games.filter(game => value(game, "title").toLocaleLowerCase().includes(query.toLocaleLowerCase())));
  const totalPages = Math.max(1, Math.ceil(matches.length / SEARCH_PAGE_SIZE)), visible = matches.slice(page * SEARCH_PAGE_SIZE, (page + 1) * SEARCH_PAGE_SIZE);
  app.innerHTML = `<div class="shell">${header()}<main class="section"><div class="top-actions"><button class="btn" data-action="home">← Front desk</button><button class="btn" data-action="library">Browse the library</button></div><div class="section-heading"><div class="eyebrow">Title search</div><h1>Results for “${escapeHtml(query)}”</h1><p>${matches.length ? "Select a game to open its record." : ""}</p></div><form class="search-form" id="search-form"><label for="result-search">Search for a game title</label><input id="result-search" name="query" value="${escapeHtml(query)}"><button class="btn gold">Search</button></form>${matches.length ? `<div class="book"><div class="spread"><section class="page left"><div class="folio">Search results</div><div class="card-grid">${visible.slice(0, 10).map(game => gameCard(game, true)).join("")}</div></section><div class="spine"></div><section class="page right"><div class="folio">Search results</div><div class="card-grid">${visible.slice(10, 20).map(game => gameCard(game, true)).join("")}</div></section></div>${pageControls(page, totalPages, matches.length, SEARCH_PAGE_SIZE, "results")}</div>` : stateMarkup("No matches", `No results found for "${query}".`, false)}</main></div>`;
  document.getElementById("search-form").addEventListener("submit", event => { event.preventDefault(); const next = new FormData(event.currentTarget).get("query").trim(); if (next) navigate(`search/${encodeURIComponent(next)}/0`); });
}
function details() {
  const game = games.find(item => value(item, "game_id") === route()[1]);
  if (!game) { app.innerHTML = `<div class="shell">${header()}${stateMarkup("Game not found", "This game could not be found.", false)}</div>`; return; }
  const recommendations = sorted(games.filter(item => item !== game && value(item, "genre_category") === value(game, "genre_category"))).slice(0, 4);
  const rating = Number(value(game, "rating_score_pct"));
  app.innerHTML = `<div class="shell">${header()}<main class="section"><button class="btn back" data-action="back">← Back</button><article class="details">${imageMarkup(game, "arch")}<div><div class="eyebrow">Game details</div><h1>${display(game, "title")}</h1><p class="about">${display(game, "description")}</p><dl class="facts"><div><dt>Release year</dt><dd>${display(game, "release_year")}</dd></div><div><dt>Developer</dt><dd>${display(game, "developer")}</dd></div><div><dt>Genre</dt><dd>${display(game, "genre_category")}</dd></div><div><dt>Platform</dt><dd>${display(game, "platform_name")}</dd></div><div style="grid-column:1/-1"><dt>Rating</dt><dd>${value(game, "rating_stars_5") ? `${escapeHtml(value(game, "rating_stars_5"))} / 5` : "Not Available"}${rating ? `<div class="rating-bar" aria-label="${rating} percent rating"><i style="width:${Math.min(rating, 100)}%"></i></div>` : ""}</dd></div></dl></div></article>${recommendations.length ? `<section class="recommendations"><div class="eyebrow">From the same shelf</div><h2>You may also remember</h2><div class="card-grid">${recommendations.map(item => gameCard(item)).join("")}</div></section>` : ""}</main></div>`;
}
function render() {
  if (dataError) { app.innerHTML = `<div class="shell">${header()}${stateMarkup("Something went wrong", "We couldn't load the game collection.")}</div>`; return; }
  const current = route();
  if (current[0] === "library") library(); else if (current[0] === "search") searchPage(); else if (current[0] === "game") details(); else frontDesk();
}
document.addEventListener("click", event => {
  const gameCardElement = event.target.closest("[data-game]");
  if (gameCardElement) { navigate(`game/${encodeURIComponent(gameCardElement.dataset.game)}`); return; }
  const category = event.target.closest("[data-category]");
  if (category) { navigate(`library/${category.dataset.category}/${category.dataset.value}/0`); return; }
  const pageButton = event.target.closest("[data-page]");
  if (pageButton && !pageButton.disabled) {
    const current = route();
    const nextRoute = current[0] === "search"
      ? `search/${current[1]}/${pageButton.dataset.page}`
      : `library/${current[1]}/${current[2]}/${pageButton.dataset.page}`;
    navigate(nextRoute);
    return;
  }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  if (action.dataset.action === "library") navigate("library");
  if (action.dataset.action === "home") navigate("home");
  if (action.dataset.action === "back") history.length > 1 ? history.back() : navigate("home");
  if (action.dataset.action === "retry") { dataError = null; render(); boot(); }
});
window.addEventListener("hashchange", render);
async function boot() {
  if (!games.length) {
    app.innerHTML = `<div class="shell">${header()}<div class="state" role="status"><div class="spinner"></div>Loading the collection…</div></div>`;
    try { games = await loadGames(); render(); }
    catch (error) { dataError = error; render(); }
  }
}
boot();
