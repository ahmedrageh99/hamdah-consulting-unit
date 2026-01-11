// js/blog.js
(function () {
  const posts = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : [];

  const topicFilter = document.getElementById("topicFilter");
  const sortFilter = document.getElementById("sortFilter");
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearBtn");
  const blogGrid = document.getElementById("blogGrid");
  const resultsMeta = document.getElementById("resultsMeta");

  const STORAGE_KEY = "hamdah_blog_filters_v1";

  function parseDate(d) {
    const t = Date.parse(d);
    return Number.isNaN(t) ? 0 : t;
  }

  function saveState() {
    const state = {
      topic: topicFilter.value,
      sort: sortFilter.value,
      search: searchInput.value.trim()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw);
      if (state?.topic) topicFilter.value = state.topic;
      if (state?.sort) sortFilter.value = state.sort;
      if (typeof state?.search === "string") searchInput.value = state.search;
    } catch {
      // ignore
    }
  }

  function uniqueTopics(list) {
    return Array.from(new Set(list.map(p => p.topic).filter(Boolean))).sort();
  }

  function buildTopicOptions() {
    const topics = uniqueTopics(posts);
    // keep "all" first
    topics.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      topicFilter.appendChild(opt);
    });
  }

  function applyFilters() {
    const topic = topicFilter.value;
    const sort = sortFilter.value;
    const q = searchInput.value.trim().toLowerCase();

    let filtered = [...posts];

    if (topic !== "all") {
      filtered = filtered.filter(p => p.topic === topic);
    }

    if (q) {
      filtered = filtered.filter(p => {
        const hay = `${p.title} ${p.excerpt} ${p.content}`.toLowerCase();
        return hay.includes(q);
      });
    }

    filtered.sort((a, b) => {
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      return sort === "oldest" ? da - db : db - da;
    });

    return filtered;
  }

  function render(list) {
    blogGrid.innerHTML = "";

    if (!list.length) {
      blogGrid.innerHTML = `
        <div style="background:#fff;padding:18px;border-radius:14px;box-shadow:0 8px 22px rgba(15,23,42,.06);">
          <strong>No posts found.</strong>
          <p style="margin:8px 0 0;color:#4b5563;">Try changing the topic or search keyword.</p>
        </div>
      `;
      resultsMeta.textContent = "0 results";
      return;
    }

    resultsMeta.textContent = `${list.length} result${list.length > 1 ? "s" : ""}`;

    const cards = list.map((p) => {
      const d = new Date(p.date);
      const pretty = Number.isNaN(d.getTime()) ? p.date : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

      return `
        <article class="blog-card">
          <div class="blog-card-top">
            <span class="blog-topic">${p.topic || "General"}</span>
            <span class="blog-date">${pretty}</span>
          </div>
          <h3 class="blog-title">${p.title}</h3>
          <p class="blog-excerpt">${p.excerpt || ""}</p>
          <details class="blog-details">
            <summary class="blog-readmore">Read more</summary>
            <p class="blog-content">${p.content || ""}</p>
          </details>
        </article>
      `;
    });

    blogGrid.innerHTML = cards.join("");
  }

  function onChange() {
    saveState();
    render(applyFilters());
  }

  function clearAll() {
    topicFilter.value = "all";
    sortFilter.value = "newest";
    searchInput.value = "";
    saveState();
    render(applyFilters());
  }

  // Init
  buildTopicOptions();
  loadState();
  render(applyFilters());

  topicFilter.addEventListener("change", onChange);
  sortFilter.addEventListener("change", onChange);
  searchInput.addEventListener("input", onChange);
  clearBtn.addEventListener("click", clearAll);
})();
