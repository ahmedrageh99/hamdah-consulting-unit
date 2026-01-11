(function () {
  const grid = document.getElementById("blogGrid");
  const topicFilter = document.getElementById("topicFilter");
  const sortFilter = document.getElementById("sortFilter");
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearBtn");
  const resultsMeta = document.getElementById("resultsMeta");

  if (!grid) return;

  const posts = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : (typeof BLOG_POSTS !== "undefined" ? BLOG_POSTS : []);

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function uniqueTopics(items) {
    return [...new Set(items.map(p => (p.topic || "").trim()).filter(Boolean))].sort();
  }

  function populateTopics() {
    const topics = uniqueTopics(posts);
    topics.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      topicFilter.appendChild(opt);
    });
  }

  function normalize(s) {
    return String(s || "").toLowerCase().trim();
  }

  function applyFilters() {
    const topic = topicFilter.value;
    const sort = sortFilter.value;
    const q = normalize(searchInput.value);

    let filtered = [...posts];

    if (topic !== "all") {
      filtered = filtered.filter(p => (p.topic || "") === topic);
    }

    if (q) {
      filtered = filtered.filter(p => {
        const hay = normalize(`${p.title} ${p.topic} ${p.content}`);
        return hay.includes(q);
      });
    }

    filtered.sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      return sort === "oldest" ? da - db : db - da;
    });

    render(filtered);
  }

  function render(items) {
    grid.innerHTML = "";

    resultsMeta.textContent = `${items.length} result${items.length === 1 ? "" : "s"}`;

    if (items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "service-card";
      empty.innerHTML = `
        <h3>No posts found</h3>
        <p style="color:#4b5563;">Try changing your topic filter or search keyword.</p>
      `;
      grid.appendChild(empty);
      return;
    }

    items.forEach(p => {
      const card = document.createElement("article");
      card.className = "blog-card";
      card.innerHTML = `
        <div class="blog-meta">
          <span class="blog-topic">${p.topic || "General"}</span>
          <span class="blog-date">${formatDate(p.date)}</span>
        </div>
        <h3 class="blog-title">${p.title}</h3>
        <p class="blog-excerpt">${p.content}</p>
        <a class="blog-link" href="#" onclick="return false;">► Read more</a>
      `;
      grid.appendChild(card);
    });
  }

  function clearAll() {
    topicFilter.value = "all";
    sortFilter.value = "newest";
    searchInput.value = "";
    applyFilters();
  }

  populateTopics();
  applyFilters();

  topicFilter.addEventListener("change", applyFilters);
  sortFilter.addEventListener("change", applyFilters);
  searchInput.addEventListener("input", applyFilters);
  clearBtn.addEventListener("click", clearAll);
})();
