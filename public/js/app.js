/**
 * L'Atelier des Cordes - Application Principale
 * Gestion des interactions : Mockup Spotify, Quotas, Modales Légales, FAQ, Menu Mobile
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSpotifyMockup();
  initQuotaIndicators();
  initLegalModals();
  initSmoothScroll();
});

/* --- Menu Mobile --- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const closeBtn = document.getElementById('mobile-menu-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
}

/* --- Simulateur de Pochette Spotify Interactif --- */
function initSpotifyMockup() {
  const nameInput = document.getElementById('mockup-artist-name');
  const titleInput = document.getElementById('mockup-track-title');
  const genreSelect = document.getElementById('mockup-genre-select');
  
  const displayArtist = document.getElementById('spotify-display-artist');
  const displayTitle = document.getElementById('spotify-display-title');
  const displayArtwork = document.getElementById('spotify-artwork-cover');
  const vinylDisc = document.getElementById('spotify-vinyl-disc');
  const playToggleBtn = document.getElementById('spotify-mock-play');

  const coverPresets = {
    blues: {
      gradient: 'from-amber-700 via-amber-900 to-stone-950',
      tag: 'Blues & Solo Soul'
    },
    rock: {
      gradient: 'from-amber-600 via-red-600 to-purple-900',
      tag: 'Rock & Power Riffs'
    },
    pop: {
      gradient: 'from-orange-400 via-pink-500 to-rose-700',
      tag: 'Pop & Melodies'
    },
    hiphop: {
      gradient: 'from-purple-900 via-zinc-900 to-black',
      tag: 'Rap & Hip-Hop 808'
    },
    rnb: {
      gradient: 'from-violet-600 via-fuchsia-800 to-indigo-950',
      tag: 'R&B & Neo-Soul'
    },
    anime: {
      gradient: 'from-pink-500 via-purple-600 to-indigo-900',
      tag: 'Anime & Gaming'
    }
  };

  function updateMockup() {
    const artist = nameInput ? nameInput.value.trim() || 'Léo' : 'Léo';
    const title = titleInput ? titleInput.value.trim() || 'Premier Riff' : 'Premier Riff';
    const genre = genreSelect ? genreSelect.value : 'rock';

    if (displayArtist) {
      displayArtist.textContent = `${artist} (Le Labo des Cordes)`;
    }
    if (displayTitle) {
      displayTitle.textContent = title;
    }

    if (displayArtwork && coverPresets[genre]) {
      displayArtwork.className = `w-full h-full bg-gradient-to-br ${coverPresets[genre].gradient} flex flex-col justify-between p-4 rounded-xl shadow-2xl relative overflow-hidden`;
    }
  }

  if (nameInput) nameInput.addEventListener('input', updateMockup);
  if (titleInput) titleInput.addEventListener('input', updateMockup);
  if (genreSelect) genreSelect.addEventListener('change', updateMockup);

  if (playToggleBtn && vinylDisc) {
    let isPlaying = true;
    playToggleBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        vinylDisc.classList.remove('animate-spin-slow-paused');
        vinylDisc.classList.add('animate-spin-slow');
        playToggleBtn.innerHTML = '<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      } else {
        vinylDisc.classList.add('animate-spin-slow-paused');
        playToggleBtn.innerHTML = '<svg class="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      }
    });
  }
}

/* --- Gestion dynamique des Quotas & Rareté --- */
function initQuotaIndicators() {
  const quotas = {
    studioRemaining: 2,
    homeRemaining: 3,
    totalPerQuarter: 12
  };

  const studioBadges = document.querySelectorAll('.quota-studio-count');
  const homeBadges = document.querySelectorAll('.quota-home-count');

  studioBadges.forEach(el => el.textContent = `${quotas.studioRemaining} places restantes`);
  homeBadges.forEach(el => el.textContent = `${quotas.homeRemaining} créneaux restants`);
}

/* --- Modales Légales & RGPD --- */
function initLegalModals() {
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const modals = document.querySelectorAll('.legal-modal');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modals.forEach(m => m.classList.add('hidden'));
      document.body.style.overflow = '';
    });
  });

  // Fermer au clic extérieur
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  });
}

/* --- Défilement fluide vers les ancres --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
