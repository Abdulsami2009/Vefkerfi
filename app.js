const state = { games: [], page: 1, query: "", category: "all", pageSize: 12 };
const app = document.getElementById("app");

function parseCSV(text) {
  const rows = [], row = [];
  let cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i], next = text[i + 1];
    if (char === '"' && quoted && next === '"') { cell += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i++;
      row.push(cell); if (row.some(Boolean)) rows.push(row.slice());
      row.length = 0; cell = "";
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, ""));
  return rows.map((values) => Object.fromEntries(headers.map((key, i) => [key, values[i] || ""])));
}

async function loadGames() {
  if (state.games.length) return;
  const response = await fetch("00/games_master_dataset.json");
  if (!response.ok) throw new Error("Could not load the game collection.");
  state.games = parseCSV(await response.text()).filter((game) => game.game_id || game.title).sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

function esc(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}
function display(value) { return value && value !== "Unknown" ? esc(value) : "Not Available"; }
function imageMarkup(game, large = false) {
  const path = game.cover_image_path && game.has_cover_image === "true" ? `00/${game.cover_image_path}` : "";
  return path ? `<img src="${esc(path)}" alt="${esc(game.title)} cover" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span hidden>No image available</span>` : "<span>No image available</span>";
}
function card(game, showYear = true) {
  return `<article class="game-card"><a href="#/game/${encodeURIComponent(game.game_id)}"><div class="cover">${imageMarkup(game)}</div><div class="card-meta"><h3>${esc(game.title)}</h3><p>${showYear ? display(game.release_year) : display(game.genre_category)}</p></div></a></article>`;
}
function layout(content) { app.innerHTML = content; app.focus(); }
function shell(title, kicker, content) {
  return `<section class="section-heading"><div><div class="section-kicker">${kicker}</div><h1>${title}</h1></div></section>${content}`;
}
function renderHome() {
  layout(`<section class="hero"><div><div class="eyebrow">The classic game library</div><h1>Find the game<br><em>you remember.</em></h1><p class="hero-copy">A place for old favourites, forgotten gems, and the feeling of finding a game from your childhood again.</p><div class="actions"><a class="button primary" href="#/library">Explore the library</a><a class="button" href="#/search">Search a title</a></div></div><div class="shelf-art" aria-label="A glowing featured shelf"></div></section>`);
}
function renderLibrary() {
  const genres = [...new Set(state.games.map((game) => game.genre_category).filter(Boolean))].sort();
  const filtered = state.category === "all" ? state.games : state.games.filter((game) => game.genre_category === state.category);
  const pages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  state.page = Math.min(state.page, pages);
  const start = (state.page - 1) * state.pageSize;
  const games = filtered.slice(start, start + state.pageSize);
  layout(shell("Browse the collection", "The classics, opened", `<div class="toolbar"><label class="sr-only" for="category">Choose a category</label><select id="category"><option value="all">All categories</option>${genres.map((genre) => `<option ${genre === state.category ? "selected" : ""} value="${esc(genre)}">${esc(genre)}</option>`).join("")}</select></div><p class="status">${filtered.length} games in this collection</p>${games.length ? `<div class="game-grid">${games.map((game) => card(game, false)).join("")}</div>` : '<div class="empty">No games found in this category.</div>'}<div class="pager"><button class="button" id="previous" ${state.page === 1 ? "disabled" : ""}>Previous</button><span>Page ${state.page} of ${pages}</span><button class="button" id="next" ${state.page === pages ? "disabled" : ""}>Next</button></div>`));
  document.getElementById("category").onchange = (event) => { state.category = event.target.value; state.page = 1; renderLibrary(); };
  document.getElementById("previous").onclick = () => { state.page--; renderLibrary(); };
  document.getElementById("next").onclick = () => { state.page++; renderLibrary(); };
}
function searchForm() { return `<form class="search-form" id="search-form"><label class="sr-only" for="search-input">Search game titles</label><input id="search-input" value="${esc(state.query)}" placeholder="Search a title..." autocomplete="off"><button class="button primary">Search</button></form>`; }
function renderSearch() {
  const results = state.games.filter((game) => game.title.toLowerCase().includes(state.query.toLowerCase()));
  const pages = Math.max(1, Math.ceil(results.length / 20)); state.page = Math.min(state.page, pages);
  const visible = results.slice((state.page - 1) * 20, state.page * 20);
  layout(shell("Search the archive", "Every title, remembered", `<div class="toolbar">${searchForm()}</div>${state.query ? `<p class="status">${results.length} result${results.length === 1 ? "" : "s"} for “${esc(state.query)}”</p>` : ""}${visible.length ? `<div class="game-grid">${visible.map((game) => card(game)).join("")}</div>` : `<div class="empty">No results found for "${esc(state.query)}".</div>`}<div class="pager"><button class="button" id="previous" ${state.page === 1 ? "disabled" : ""}>Previous</button><span>Page ${state.page} of ${pages}</span><button class="button" id="next" ${state.page === pages ? "disabled" : ""}>Next</button></div>`));
  document.getElementById("search-form").onsubmit = (event) => { event.preventDefault(); state.query = document.getElementById("search-input").value.trim(); state.page = 1; renderSearch(); };
  document.getElementById("previous").onclick = () => { state.page--; renderSearch(); };
  document.getElementById("next").onclick = () => { state.page++; renderSearch(); };
}
function renderDetails(id) {
  const game = state.games.find((item) => item.game_id === id);
  if (!game) return renderNotFound();
  const similar = state.games.filter((item) => item.game_id !== id && item.genre_category === game.genre_category).slice(0, 4);
  layout(`<article class="detail"><button class="button" id="back-button">← Back</button><div class="detail-layout" style="margin-top:40px"><div class="cover detail-cover">${imageMarkup(game, true)}</div><div><div class="section-kicker">${display(game.genre_category)}</div><h1>${esc(game.title)}</h1><p class="detail-intro">${display(game.description)}</p><dl class="facts"><div class="fact"><dt>Release year</dt><dd>${display(game.release_year)}</dd></div><div class="fact"><dt>Developer</dt><dd>${display(game.developer)}</dd></div><div class="fact"><dt>Platform</dt><dd>${display(game.platform_name)}</dd></div><div class="fact"><dt>Rating</dt><dd>${game.rating_stars_5 ? `${esc(game.rating_stars_5)} / 5` : "Not Available"}</dd></div></dl></div></div>${similar.length ? `<section style="margin-top:70px"><div class="section-kicker">Keep exploring</div><h2>Similar games</h2><div class="game-grid">${similar.map((item) => card(item)).join("")}</div></section>` : ""}</article>`);
  document.getElementById("back-button").onclick = () => history.back();
}
function renderNotFound() { layout('<div class="empty">This page could not be found. <a href="#/library">Return to the library.</a></div>'); }
async function route() {
  layout('<div class="loading">Opening the collection...</div>');
  try {
    await loadGames();
    const [, page, id] = location.hash.split("/");
    if (page === "library") renderLibrary();
    else if (page === "search") renderSearch();
    else if (page === "game" && id) renderDetails(decodeURIComponent(id));
    else renderHome();
  } catch (error) { layout(`<div class="empty">${esc(error.message)} <button class="button" onclick="route()">Retry</button></div>`); }
}
window.addEventListener("hashchange", route);
route();
