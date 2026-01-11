(function () {
  const grid = document.getElementById("blogGrid");
  const topicFilter = document.getElementById("topicFilter");
  const sortFilter = document.getElementById("sortFilter");
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearBtn");
  const resultsMeta = document.getElementById("resultsMeta");

  const posts = BLOG_POSTS;

  function render(list) {
    grid.innerHTML = "";
    if (!list.length) {
      grid.innerHTML = "<p>No posts found.</p>";
      return;
    }

    list.forEach(post => {
      const card = document.createElement("article");
      card.className = "service-card";
      card.innerHTML = `
        <h3>${post.title}</h3>
        <small>${post.topic} • ${post.date}</small>
        <p>${post.content}</p>
      `;
      grid.appendChild(card);
    });

    resultsMeta.textContent = list.length + " result(s)";
  }

  function applyFilters() {
    let filtered = [...posts];
    const q = searchInput.value.toLowerCase();

    if (topicFilter.value !== "all") {
      filtered = filtered.filter(p => p.topic === topicFilter.value);
    }

    if (q) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    }

    filtered.sort((a,b)=>{
      return sortFilter.value==="oldest"
        ? new Date(a.date)-new Date(b.date)
        : new Date(b.date)-new Date(a.date)
    });

    render(filtered);
  }

  topicFilter.addEventListener("change", applyFilters);
  sortFilter.addEventListener("change", applyFilters);
  searchInput.addEventListener("input", applyFilters);
  clearBtn.addEventListener("click", ()=>{
    topicFilter.value="all";
    searchInput.value="";
    sortFilter.value="newest";
    applyFilters();
  });

  render(posts);
})();
