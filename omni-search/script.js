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
          // Fallback if the payload properties look weird
          starBadge.textContent = "★ 550+";
        }
      })
      .catch(error => {
        console.error("Error fetching GitHub stars:", error);
      // Fallback gracefully instead of hiding the badge entirely
        starBadge.textContent = "★ 550+";
      });
  }

  // Theme toggle (dark / light)
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "omnisearch-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      themeToggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  if (themeToggle) {
    // Sync button labels with whatever the inline head script already set
    applyTheme(document.documentElement.getAttribute("data-theme") || "light");

    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Mobile hamburger menu
  const menuToggle = document.getElementById("menuToggle");
  const mobileNavLinks = document.getElementById("navLinks");

  function closeMobileMenu() {
    if (!menuToggle || !mobileNavLinks) return;
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileNavLinks.classList.remove("is-open");
  }

  function toggleMobileMenu() {
    if (!menuToggle || !mobileNavLinks) return;
    const isOpen = mobileNavLinks.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  }

  if (menuToggle && mobileNavLinks) {
    menuToggle.addEventListener("click", toggleMobileMenu);

    // Close on outside click
    document.addEventListener("click", (e) => {
      const clickedInsideMenu = mobileNavLinks.contains(e.target) || menuToggle.contains(e.target);
      if (!clickedInsideMenu && mobileNavLinks.classList.contains("is-open")) {
        closeMobileMenu();
      }
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileMenu();
    });

    // Close automatically if the viewport grows back to desktop width
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMobileMenu();
    });
  }

  // Navbar shadow once the page has scrolled
  const navbar = document.getElementById("siteNavbar");
  function updateNavbarShadow() {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  updateNavbarShadow();
  window.addEventListener("scroll", updateNavbarShadow, { passive: true });

  // Back to top button
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    function updateBackToTop() {
      backToTop.classList.toggle("is-visible", window.scrollY > 480);
    }
    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Subtle scroll-reveal for card grids (skipped entirely if the user prefers reduced motion)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = Array.from(
    document.querySelectorAll(
      ".bento-card, .android-card, .download-card, .release-highlights article, .faq-link-card"
    )
  );

  if (revealTargets.length > 0) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
    } else {
      revealTargets.forEach((el) => el.classList.add("reveal"));
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealTargets.forEach((el) => revealObserver.observe(el));
    }
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

      closeMobileMenu();
    });
  });
});
