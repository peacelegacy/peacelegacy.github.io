document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("skinsGrid");
  const searchInput = document.getElementById("searchInput");

  const imageModal = document.getElementById("imageModal");
  const imagePreview = document.getElementById("imagePreview");
  const imageClose = document.getElementById("imageClose");
  const tooltip = document.getElementById("tooltip");

  const filterButtons = document.querySelectorAll("#typeFilters .filter-btn");

  const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px"
  }
);


  let currentType = "all";

  filterButtons.forEach(btn => {
    btn.onclick = () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentType = btn.dataset.type;
      renderSkins();
    };
  });

  function renderSkins() {
    const query = searchInput.value.toLowerCase();

    const filtered = window.allSkins.filter(skin => {
      const matchesType = currentType === "all" || skin.type === currentType;
      const matchesSearch = skin.name.toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });

    grid.innerHTML = "";

    if (!filtered.length) {
      grid.innerHTML = `
        <p style="color:var(--white); grid-column:1/-1; text-align:center;">
          No skins found.
        </p>`;
      return;
    }

    filtered.forEach((skin, index) => {
      const downloadUrl = skin.modelUrl || skin.textureUrl;
      
      const card = document.createElement("div");
      card.className = "grid-box";
      
      card.innerHTML = `
      <div class="grid-image">
      <img src="${skin.previewUrl}" alt="${skin.name}">
      </div>

      <div class="grid-actions">
      ${
        downloadUrl
        ? `<button class="install">Download</button>`
        : `<span class="install" style="opacity:.4">No file</span>`
      }
      </div>
      `;
      
      if (downloadUrl) {
        const btn = card.querySelector(".install");
        btn.onclick = () => {
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = "";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
      }

      card.querySelector("img").onclick = () => {
        imagePreview.src = skin.previewUrl;
        imageModal.classList.add("active");
      };

      card.onmouseenter = () => {
        tooltip.innerHTML = `
          <div>${skin.name}</div>
          <div class="type">${skin.type.charAt(0).toUpperCase() + skin.type.slice(1)}</div>

        `;
        tooltip.classList.add("show");
      };

      card.onmousemove = e => {
        tooltip.style.left = e.clientX + 14 + "px";
        tooltip.style.top = e.clientY + 14 + "px";
      };

      card.onmouseleave = () => {
        tooltip.classList.remove("show");
      };

      grid.appendChild(card);
      observer.observe(card);
      
      setTimeout(() => {card.classList.add("show");}, index * 60);

    });
  }

  searchInput.addEventListener("input", renderSkins);

  imageClose.onclick = () => {
    imageModal.classList.remove("active");
    imagePreview.src = "";
  };

  imageModal.onclick = e => {
    if (e.target === imageModal) {
      imageModal.classList.remove("active");
      imagePreview.src = "";
    }
  };

  lucide.createIcons();
  renderSkins();
});
