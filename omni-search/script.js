document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  const yearEl = document.getElementById("year");
  const assetLinks = Array.from(document.querySelectorAll("[data-asset-path]"));
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  assetLinks.forEach((link) => {
    const assetPath = link.getAttribute("data-asset-path");
    if (!assetPath) {
      return;
    }

    if (window.location.protocol === "file:") {
      link.href = new URL(assetPath, window.location.href.replace(/[#?].*$/, "")).href;
      return;
    }

    link.href = `/omni-search/${assetPath}`;
  });

  // Fetch real-time GitHub Stars
  const starBadge = document.getElementById("github-stars");
  if (starBadge) {
    fetch("https://api.github.com/repos/Eul45/omni-search")
      .then(response => response.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          // Updates the text to show the actual star count, e.g., "★ 124"
          starBadge.textContent = `★ ${data.stargazers_count.toLocaleString()}`;
        } else {
          // Hide it if the API limit is reached or fails
          starBadge.style.display = "none";
        }
      })
      .catch(error => {
        console.error("Error fetching GitHub stars:", error);
        starBadge.style.display = "none";
      });
  }

  // Active navigation handling
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const sections = Array.from(document.querySelectorAll("[data-nav-section]"));

  function setActiveNav(sectionId) {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.navLink === sectionId);
    });
  }

  // Scroll spy
  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // Smooth scroll click handler
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Scroll to element offset by fixed navbar height (approx 80px)
        const y = targetSection.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setActiveNav(targetId);
      }
    });
  });
});
