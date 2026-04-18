const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-btn");
const luckyBtn = document.getElementById("lucky-btn");
const suggestions = document.getElementById("suggestions");
const results = document.getElementById("results");
const resultsList = document.getElementById("results-list");
const chips = document.querySelectorAll(".chip");

const mockIndex = [
  {
    title: "Cloudflare Pages - Build full-stack apps",
    url: "https://developers.cloudflare.com/pages/",
    snippet: "Deploy static sites and full-stack applications globally with simple CI/CD.",
    keywords: ["cloudflare", "pages", "deploy", "frontend", "edge"]
  },
  {
    title: "MDN Web Docs - JavaScript",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    snippet: "Learn JavaScript fundamentals and modern browser APIs with practical examples.",
    keywords: ["javascript", "js", "tutorial", "learn", "frontend"]
  },
  {
    title: "GitHub Docs - Actions",
    url: "https://docs.github.com/actions",
    snippet: "Automate build, test, and deployment workflows with GitHub Actions.",
    keywords: ["github", "actions", "ci", "cd", "workflow"]
  },
  {
    title: "Frontend Interview Handbook",
    url: "https://www.frontendinterviewhandbook.com/",
    snippet: "Curated frontend interview questions, roadmaps, and preparation material.",
    keywords: ["frontend", "interview", "questions", "react", "css"]
  },
  {
    title: "Google Search Tips",
    url: "https://support.google.com/websearch/answer/2466433",
    snippet: "Use operators and advanced syntax to get more precise search results.",
    keywords: ["google", "search", "tips", "operator", "query"]
  },
  {
    title: "Web.dev - Performance",
    url: "https://web.dev/performance/",
    snippet: "Best practices to improve site speed, Core Web Vitals, and user experience.",
    keywords: ["performance", "core web vitals", "web", "speed", "frontend"]
  }
];

const suggestedQueries = [
  "cloudflare pages deploy",
  "javascript array methods",
  "frontend interview questions",
  "github actions tutorial",
  "web performance optimization",
  "css grid guide",
  "react hooks cheatsheet",
  "google search operators"
];

function normalize(text) {
  return text.trim().toLowerCase();
}

function getSuggestions(query) {
  const normalized = normalize(query);
  if (!normalized) {
    return [];
  }

  return suggestedQueries
    .filter((item) => item.includes(normalized))
    .slice(0, 6);
}

function renderSuggestions(items) {
  suggestions.innerHTML = "";

  if (!items.length) {
    suggestions.hidden = true;
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion-btn";
    button.textContent = item;
    button.addEventListener("click", () => {
      input.value = item;
      suggestions.hidden = true;
      runSearch(item);
    });
    fragment.appendChild(button);
  });

  suggestions.appendChild(fragment);
  suggestions.hidden = false;
}

function scoreItem(item, query) {
  const queryWords = normalize(query).split(/\s+/).filter(Boolean);
  const haystack = `${item.title} ${item.snippet} ${item.keywords.join(" ")}`.toLowerCase();
  let score = 0;

  queryWords.forEach((word) => {
    if (item.keywords.some((keyword) => keyword.includes(word))) {
      score += 4;
    }
    if (item.title.toLowerCase().includes(word)) {
      score += 3;
    }
    if (haystack.includes(word)) {
      score += 1;
    }
  });

  return score;
}

function findMatches(query) {
  const normalized = normalize(query);
  if (!normalized) {
    return [];
  }

  return mockIndex
    .map((item) => ({ ...item, score: scoreItem(item, normalized) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function resultCard(item) {
  return `
    <article class="result-item">
      <p class="result-url">${item.url}</p>
      <a class="result-title" href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a>
      <p class="result-snippet">${item.snippet}</p>
    </article>
  `;
}

function runSearch(query) {
  const normalized = normalize(query);
  if (!normalized) {
    results.hidden = true;
    return;
  }

  const matches = findMatches(normalized);
  if (!matches.length) {
    resultsList.innerHTML = `
      <p class="empty-result">未找到本地模拟结果。你可以尝试更具体的关键词，例如 “cloudflare pages deploy”。</p>
    `;
  } else {
    resultsList.innerHTML = matches.map(resultCard).join("");
  }

  results.hidden = false;
}

function runLuckySearch() {
  const query = normalize(input.value);
  if (!query) {
    input.value = "cloudflare pages deploy";
  }

  const finalQuery = normalize(input.value);
  runSearch(finalQuery);

  const topHit = findMatches(finalQuery)[0];
  if (topHit) {
    window.open(topHit.url, "_blank", "noopener,noreferrer");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  suggestions.hidden = true;
  runSearch(input.value);
});

input.addEventListener("input", () => {
  const items = getSuggestions(input.value);
  renderSuggestions(items);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    suggestions.hidden = true;
  }
});

clearBtn.addEventListener("click", () => {
  input.value = "";
  suggestions.hidden = true;
  results.hidden = true;
  input.focus();
});

luckyBtn.addEventListener("click", runLuckySearch);

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.textContent || "";
    suggestions.hidden = true;
    runSearch(input.value);
  });
});

document.addEventListener("click", (event) => {
  if (!form.contains(event.target)) {
    suggestions.hidden = true;
  }
});
