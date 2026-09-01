/**
 * Dynamic Edge - Product Landing Page Controller
 * Features: Rich Polyphonic Lofi Synth Audio, Interactive Island Simulator, & Custom Video Player
 */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. Scroll-Reveal Observer
  // =========================================================================
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("is-visible"));
  }

  // =========================================================================
  // 2. Mobile Menu Navigation
  // =========================================================================
  const mobileToggle = document.getElementById("mobile-nav-toggle");
  const navLinks = document.getElementById("nav-links-menu");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");
    });

    navLinks.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-open");
      });
    });
  }

  // =========================================================================
  // 3. Hero Video Showcase Controls (Play/Pause & Seekbar)
  // =========================================================================
  const heroVideo = document.getElementById("hero-video-player");
  const vidPlayBtn = document.getElementById("vid-play-toggle");
  const vidScrubTrack = document.getElementById("vid-scrub-track");
  const vidScrubFill = document.getElementById("vid-scrub-fill");
  const vidTimeDisplay = document.getElementById("vid-time-display");

  function formatVideoTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.loop = true;
    heroVideo.play().catch(() => {
      console.log('Video autoplay blocked, waiting for user interaction');
    });

    function updateVideoProgress() {
      if (!heroVideo.duration) return;
      const pct = (heroVideo.currentTime / heroVideo.duration) * 100;
      if (vidScrubFill) vidScrubFill.style.width = `${pct}%`;
      if (vidTimeDisplay) {
        vidTimeDisplay.textContent = `${formatVideoTime(heroVideo.currentTime)} / ${formatVideoTime(heroVideo.duration)}`;
      }
    }

    heroVideo.addEventListener("timeupdate", updateVideoProgress);
    
    // Ensure video loops when it ends
    heroVideo.addEventListener("ended", () => {
      heroVideo.currentTime = 0;
      heroVideo.play();
    });

    function toggleVideoPlay() {
      if (heroVideo.paused) {
        heroVideo.play();
        if (vidPlayBtn) {
          vidPlayBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        }
      } else {
        heroVideo.pause();
        if (vidPlayBtn) {
          vidPlayBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        }
      }
    }

    if (vidPlayBtn) vidPlayBtn.addEventListener("click", toggleVideoPlay);
    heroVideo.addEventListener("click", toggleVideoPlay);

    if (vidScrubTrack) {
      vidScrubTrack.addEventListener("click", (e) => {
        const rect = vidScrubTrack.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        heroVideo.currentTime = pos * heroVideo.duration;
        updateVideoProgress();
      });
    }
  }

  // =========================================================================
  // 4. Real Audio Player for Interactive Island
  // =========================================================================
  let islandAudio = null;
  let isSongPlaying = false;
  let currentSongSec = 0;
  const totalSongSec = 165; // 2:45

  function initAudio() {
    if (!islandAudio) {
      islandAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
      islandAudio.loop = true;
      islandAudio.volume = 0.5; // Lower volume for calmer effect
    }
  }

  function startSongPlayback() {
    initAudio();
    isSongPlaying = true;
    islandAudio.play().catch(() => {
      console.log('Audio autoplay blocked, waiting for user interaction');
    });
    
    if (!islandAudio.progressInterval) {
      islandAudio.progressInterval = setInterval(() => {
        if (isSongPlaying && !islandAudio.paused) {
          currentSongSec = islandAudio.currentTime;
          if (currentSongSec >= totalSongSec) {
            currentSongSec = 0;
            islandAudio.currentTime = 0;
          }
          updateSimScrubUI();
        }
      }, 1000);
    }
  }

  function stopSongPlayback() {
    isSongPlaying = false;
    if (islandAudio) {
      islandAudio.pause();
    }
  }

  function formatSongTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updateSimScrubUI() {
    const fill = document.getElementById("sim-progress-fill");
    const timeDisplay = document.getElementById("sim-time-text");
    if (fill) {
      fill.style.width = `${(currentSongSec / totalSongSec) * 100}%`;
    }
    if (timeDisplay) {
      timeDisplay.textContent = `${formatSongTime(currentSongSec)} / ${formatSongTime(totalSongSec)}`;
    }
  }

  // Island Play/Pause Button
  const playBtn = document.getElementById("sim-play-btn");
  const eqBars = document.querySelectorAll(".eq-bar");
  const audioStatusText = document.getElementById("island-audio-indicator");

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (isSongPlaying) {
        stopSongPlayback();
        playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        eqBars.forEach(b => b.style.animationPlayState = "paused");
        if (audioStatusText) audioStatusText.innerHTML = `<span>Paused</span>`;
      } else {
        startSongPlayback();
        playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        eqBars.forEach(b => b.style.animationPlayState = "running");
        if (audioStatusText) audioStatusText.innerHTML = `<div class="audio-pulse-dot"></div><span>Playing</span>`;
      }
    });
  }

  // Interactive Scrubbar
  const scrubbar = document.getElementById("sim-scrubbar");
  if (scrubbar) {
    scrubbar.addEventListener("click", (e) => {
      const rect = scrubbar.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      currentSongSec = pos * totalSongSec;
      if (islandAudio) {
        islandAudio.currentTime = currentSongSec;
      }
      updateSimScrubUI();
      if (!isSongPlaying) {
        startSongPlayback();
      }
    });
  }

  // =========================================================================
  // 5. Interactive Island Tab Switcher
  // =========================================================================
  const islandTabs = document.querySelectorAll(".island-tab-btn");
  const islandPanels = {
    media: document.getElementById("panel-media"),
    timer: document.getElementById("panel-timer"),
    clipboard: document.getElementById("panel-clipboard")
  };

  islandTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      islandTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.dataset.tab;
      Object.keys(islandPanels).forEach(k => {
        if (islandPanels[k]) {
          islandPanels[k].classList.toggle("active", k === target);
        }
      });
    });
  });

  // Timer Presets
  const timerChips = document.querySelectorAll(".timer-pill-chip");
  const timerDisplay = document.getElementById("sim-timer-counter");

  timerChips.forEach(chip => {
    chip.addEventListener("click", () => {
      timerChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      if (timerDisplay) {
        timerDisplay.textContent = chip.dataset.duration;
      }
    });
  });

  // Clipboard Category Filter
  const clipFilterTags = document.querySelectorAll(".clip-filter-tag");
  const clipTiles = document.querySelectorAll(".clip-card-tile");

  clipFilterTags.forEach(tag => {
    tag.addEventListener("click", () => {
      clipFilterTags.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");

      const filter = tag.dataset.filter;
      clipTiles.forEach(tile => {
        if (filter === "all" || tile.dataset.type === filter) {
          tile.style.display = "block";
        } else {
          tile.style.display = "none";
        }
      });
    });
  });

  clipTiles.forEach(tile => {
    tile.addEventListener("click", () => {
      const originalHeader = tile.querySelector(".clip-tile-header").innerHTML;
      tile.querySelector(".clip-tile-header").innerHTML = `<span style="color: var(--accent-mint); font-weight: bold;">✓ Copied</span>`;
      setTimeout(() => {
        tile.querySelector(".clip-tile-header").innerHTML = originalHeader;
      }, 1400);
    });
  });

  // =========================================================================
  // 6. Tabbed Screenshots Gallery
  // =========================================================================
  const galleryTabs = document.querySelectorAll(".gallery-tab-btn");
  const galleryImage = document.getElementById("gallery-viewport-img");
  const galleryCaption = document.getElementById("gallery-caption-banner");

  const galleryContent = {
    media: {
      src: "assets/media-demo.png",
      alt: "Dynamic Edge Universal Media Player with Live Audio Visualizer",
      caption: "Universal Media Controls: Real-time seekbar progress, volume control, and spectrum audio visualizer."
    },
    timers: {
      src: "assets/timer-demo.png",
      alt: "Dynamic Edge Mini-Apps, Countdown Timers, and Stopwatch",
      caption: "Mini-Apps Shelf: Instant countdown timer presets (1m, 5m, 15m, 25m Pomodoro) and stopwatch with laps."
    },
    clipboard: {
      src: "assets/clipboard-demo.png",
      alt: "Dynamic Edge Smart Clipboard Manager Shelf",
      caption: "Smart Clipboard Shelf: Automatically archives text, code snippets, URLs, and hex colors with category search."
    },
    launcher: {
      src: "assets/launcher.png",
      alt: "Dynamic Edge App & Folder Launcher",
      caption: "App & Folder Launcher: Quick access to your favorite applications and folders with customizable shortcuts."
    },
    docking: {
      src: "assets/left-dock.png",
      alt: "Dynamic Edge Left & Right Screen Edge Blade Docking",
      caption: "Dual Docking Modes: Top Notch capsule or Left/Right Screen Edge Blade with fluid spring physics."
    },
    settings: {
      src: "assets/settings-general.png",
      alt: "Dynamic Edge Settings & Customization",
      caption: "Deep Customization: Tailor animation speeds, OLED dark modes, dwell time hysteresis, and shortcuts."
    }
  };

  galleryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      galleryTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const key = tab.dataset.gallery;
      if (galleryContent[key] && galleryImage) {
        galleryImage.classList.remove("slide-left", "slide-right");
        void galleryImage.offsetWidth; // Trigger reflow
        galleryImage.classList.add("slide-left");
        
        setTimeout(() => {
          galleryImage.src = galleryContent[key].src;
          galleryImage.alt = galleryContent[key].alt;
          if (galleryCaption) galleryCaption.textContent = galleryContent[key].caption;
        }, 200);
      }
    });
  });

  // Gallery arrow navigation
  const galleryKeys = Object.keys(galleryContent);

  function getCurrentGalleryIndex() {
    const activeTab = document.querySelector(".gallery-tab-btn.active");
    if (activeTab) {
      const key = activeTab.dataset.gallery;
      return galleryKeys.indexOf(key);
    }
    return 0;
  }

  function navigateGallery(direction) {
    const currentIndex = getCurrentGalleryIndex();
    const newIndex = (currentIndex + direction + galleryKeys.length) % galleryKeys.length;
    const key = galleryKeys[newIndex];
    
    // Update active tab
    galleryTabs.forEach(t => t.classList.remove("active"));
    const activeTab = document.querySelector(`[data-gallery="${key}"]`);
    if (activeTab) activeTab.classList.add("active");

    // Animate image
    if (galleryContent[key] && galleryImage) {
      galleryImage.classList.remove("slide-left", "slide-right");
      void galleryImage.offsetWidth; // Trigger reflow
      galleryImage.classList.add(direction > 0 ? "slide-left" : "slide-right");
      
      setTimeout(() => {
        galleryImage.src = galleryContent[key].src;
        galleryImage.alt = galleryContent[key].alt;
        if (galleryCaption) galleryCaption.textContent = galleryContent[key].caption;
      }, 200);
    }
  }

  const leftArrow = document.querySelector(".gallery-nav-left");
  const rightArrow = document.querySelector(".gallery-nav-right");

  if (leftArrow) {
    leftArrow.addEventListener("click", () => navigateGallery(-1));
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", () => navigateGallery(1));
  }

  // =========================================================================
  // 7. FAQ Accordion (ALL Start Closed by Default)
  // =========================================================================
  const faqCards = document.querySelectorAll(".faq-card");
  faqCards.forEach(card => {
    const trigger = card.querySelector(".faq-trigger");
    if (trigger) {
      trigger.addEventListener("click", () => {
        const isCurrentActive = card.classList.contains("active");
        faqCards.forEach(c => c.classList.remove("active"));
        if (!isCurrentActive) {
          card.classList.add("active");
        }
      });
    }
  });

  // =========================================================================
  // 8. Feature Tile Mouse-Tracking Effect
  // =========================================================================
  const featureTiles = document.querySelectorAll('.feature-tile');
  
  featureTiles.forEach(tile => {
    tile.addEventListener('mousemove', (e) => {
      const rect = tile.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      tile.style.setProperty('--mouse-x', `${x}%`);
      tile.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // =========================================================================
  // 9. Navbar Scroll Styling with Smooth Transition
  // =========================================================================
  const navbar = document.querySelector(".navbar");
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener("scroll", () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (lastScrollY > 30) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
        ticking = false;
      });
      ticking = true;
    }
  });
});
