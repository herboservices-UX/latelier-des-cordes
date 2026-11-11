/**
 * Le Labo des Cordes - Comparateur Audio A/B 100% Natif Mobile-First
 * Garanti zéro blocage sur iOS (iPhone / iPad), Android, Safari & Chrome.
 * Utilise le moteur audio HTML5 natif sans détournement WebAudio pour garantir
 * une diffusion directe à plein volume sur les haut-parleurs du téléphone.
 */

class AudioComparisonPlayer {
  constructor() {
    this.player = document.getElementById('comparison-audio-player');
    this.currentMode = 'studio'; // 'smartphone' or 'studio'
    this.isPlaying = false;

    this.tracks = {
      smartphone: {
        title: 'To The Star (Prise Brute • Raw)',
        src: 'assets/audio/smartphone-raw.m4a',
        fallback: 'assets/audio/smartphone-raw.wav',
        badgeHtml: '<svg class="w-3.5 h-3.5 stroke-current fill-none shrink-0" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg><span><strong>Prise Brute</strong> (To The Star • Raw)</span>',
        badgeClass: 'text-xs px-3 py-1.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700 font-mono inline-flex items-center gap-1.5'
      },
      studio: {
        title: 'Flying Away (Mix & Master • blvckbeats808)',
        src: 'assets/audio/studio-final.m4a',
        fallback: 'assets/audio/studio-final.wav',
        badgeHtml: '<svg class="w-3.5 h-3.5 fill-current text-pink-400 shrink-0" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.1-6.2-4.5-6.2 4.5 2.3-7.1-6.1-4.5h7.6z"/></svg><span><strong>Mix Studio Pro</strong> (Flying Away • Master)</span>',
        badgeClass: 'text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20 text-pink-300 border border-pink-500/40 font-mono inline-flex items-center gap-1.5'
      }
    };

    // Canvas visualizer
    this.canvas = document.getElementById('audio-visualizer-canvas');
    this.canvasCtx = this.canvas ? this.canvas.getContext('2d') : null;
    this.animFrame = null;

    this.initDOM();
  }

  initDOM() {
    this.playBtn = document.getElementById('audio-play-btn');
    this.playIcon = document.getElementById('audio-play-icon');
    this.playText = document.getElementById('audio-play-text');
    this.modeSmartphoneBtn = document.getElementById('mode-smartphone-btn');
    this.modeStudioBtn = document.getElementById('mode-studio-btn');
    this.modeBadge = document.getElementById('audio-current-mode-badge');

    this.timeCurrent = document.getElementById('audio-time-current');
    this.timeDuration = document.getElementById('audio-time-duration');
    this.trackTitle = document.getElementById('audio-track-title');
    this.progressContainer = document.getElementById('audio-progress-container');
    this.progressBar = document.getElementById('audio-progress-bar');

    if (!this.player) {
      this.player = new Audio();
      this.player.setAttribute('playsinline', '');
      this.player.setAttribute('webkit-playsinline', '');
    }

    // Définition initiale
    this.setupAudioSource('studio');

    // Événement clic sur le bouton Play (User-gesture direct)
    if (this.playBtn) {
      this.playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.togglePlay();
      });
    }

    // Clics sur les modes
    if (this.modeSmartphoneBtn) {
      this.modeSmartphoneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.setMode('smartphone');
      });
    }

    if (this.modeStudioBtn) {
      this.modeStudioBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.setMode('studio');
      });
    }

    // Contrôle direct de la position de lecture via la barre
    if (this.progressContainer) {
      this.progressContainer.addEventListener('click', (e) => {
        const rect = this.progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        if (width > 0 && this.player.duration > 0) {
          const pct = Math.max(0, Math.min(1, clickX / width));
          this.player.currentTime = pct * this.player.duration;
        }
      });
    }

    // Événements natifs du lecteur
    this.player.addEventListener('play', () => {
      this.isPlaying = true;
      this.updatePlayBtnUI(true);
      this.startVisualizer();
    });

    this.player.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updatePlayBtnUI(false);
      this.stopVisualizer();
    });

    this.player.addEventListener('timeupdate', () => {
      const cur = this.player.currentTime || 0;
      const dur = this.player.duration || 0;

      if (this.timeCurrent) {
        this.timeCurrent.textContent = this.formatTime(cur);
      }
      if (this.timeDuration && dur > 0) {
        this.timeDuration.textContent = this.formatTime(dur);
      }
      if (this.progressBar && dur > 0) {
        const pct = (cur / dur) * 100;
        this.progressBar.style.width = `${pct}%`;
      }
    });

    this.player.addEventListener('ended', () => {
      // Boucle fluide
      this.player.currentTime = 0;
      this.player.play().catch(e => console.warn(e));
    });

    this.player.addEventListener('error', () => {
      console.warn('Audio format error, switching to WAV fallback.');
      const track = this.tracks[this.currentMode];
      if (track && this.player.src.indexOf('.wav') === -1) {
        const cur = this.player.currentTime || 0;
        this.player.src = track.fallback;
        this.player.currentTime = cur;
        if (this.isPlaying) {
          this.player.play().catch(e => console.error(e));
        }
      }
    });

    this.drawIdleVisualizer();
  }

  setupAudioSource(mode) {
    const track = this.tracks[mode];
    if (!track || !this.player) return;

    this.player.muted = false;
    this.player.volume = 1.0;

    const canM4A = this.player.canPlayType && (this.player.canPlayType('audio/mp4') || this.player.canPlayType('audio/x-m4a'));
    this.player.src = (canM4A !== '') ? track.src : track.fallback;
    this.player.load();

    if (this.trackTitle) {
      this.trackTitle.textContent = track.title;
    }
  }

  togglePlay() {
    if (this.player.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    if (!this.player) return;

    this.player.muted = false;
    this.player.volume = 1.0;

    const promise = this.player.play();
    if (promise !== undefined) {
      promise.then(() => {
        this.isPlaying = true;
        this.updatePlayBtnUI(true);
        this.startVisualizer();
      }).catch(err => {
        console.warn('Playback error, retrying with WAV format:', err);
        const track = this.tracks[this.currentMode];
        if (track && this.player.src.indexOf('.wav') === -1) {
          this.player.src = track.fallback;
          this.player.load();
          this.player.play().then(() => {
            this.isPlaying = true;
            this.updatePlayBtnUI(true);
            this.startVisualizer();
          }).catch(e2 => console.error('All audio fallbacks failed:', e2));
        }
      });
    }
  }

  pause() {
    if (!this.player) return;
    this.player.pause();
    this.isPlaying = false;
    this.updatePlayBtnUI(false);
    this.stopVisualizer();
  }

  setMode(mode) {
    if (this.currentMode === mode) return;
    this.currentMode = mode;

    this.updateModeUI(mode);

    if (!this.player) return;

    const savedTime = this.player.currentTime || 0;
    const wasPlaying = !this.player.paused;

    const track = this.tracks[mode];
    const canM4A = this.player.canPlayType && (this.player.canPlayType('audio/mp4') || this.player.canPlayType('audio/x-m4a'));
    const nextSrc = (canM4A !== '') ? track.src : track.fallback;

    this.player.src = nextSrc;
    this.player.muted = false;
    this.player.volume = 1.0;

    if (this.trackTitle) {
      this.trackTitle.textContent = track.title;
    }

    const onLoaded = () => {
      try {
        if (this.player.duration > 0) {
          this.player.currentTime = savedTime % this.player.duration;
        }
      } catch (e) {}
      if (wasPlaying) {
        this.player.play().catch(e => console.warn(e));
      }
      this.player.removeEventListener('loadedmetadata', onLoaded);
    };

    this.player.addEventListener('loadedmetadata', onLoaded);
    this.player.load();

    if (wasPlaying && this.player.readyState >= 1) {
      this.player.play().catch(e => console.warn(e));
    }
  }

  updateModeUI(mode) {
    if (!this.modeSmartphoneBtn || !this.modeStudioBtn) return;

    if (mode === 'smartphone') {
      this.modeSmartphoneBtn.classList.add('bg-zinc-800', 'text-white', 'border-zinc-500');
      this.modeSmartphoneBtn.classList.remove('bg-transparent', 'text-zinc-400', 'border-transparent');

      this.modeStudioBtn.classList.remove('bg-gradient-to-r', 'from-pink-600', 'to-orange-500', 'text-white', 'shadow-lg');
      this.modeStudioBtn.classList.add('bg-transparent', 'text-zinc-400', 'border-transparent');

      if (this.modeBadge) {
        this.modeBadge.innerHTML = this.tracks.smartphone.badgeHtml;
        this.modeBadge.className = this.tracks.smartphone.badgeClass;
      }
    } else {
      this.modeStudioBtn.classList.add('bg-gradient-to-r', 'from-pink-600', 'to-orange-500', 'text-white', 'shadow-lg');
      this.modeStudioBtn.classList.remove('bg-transparent', 'text-zinc-400', 'border-transparent');

      this.modeSmartphoneBtn.classList.remove('bg-zinc-800', 'text-white', 'border-zinc-500');
      this.modeSmartphoneBtn.classList.add('bg-transparent', 'text-zinc-400', 'border-transparent');

      if (this.modeBadge) {
        this.modeBadge.innerHTML = this.tracks.studio.badgeHtml;
        this.modeBadge.className = this.tracks.studio.badgeClass;
      }
    }
  }

  updatePlayBtnUI(playing) {
    if (this.playIcon) {
      if (playing) {
        this.playIcon.innerHTML = '<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      } else {
        this.playIcon.innerHTML = '<svg class="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      }
    }
    if (this.playText) {
      this.playText.textContent = playing ? 'Mettre en pause' : 'Écouter le comparatif sonore';
    }
  }

  startVisualizer() {
    if (!this.canvas || !this.canvasCtx) return;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);

    const bars = 36;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const barWidth = width / bars;

    const draw = () => {
      this.animFrame = requestAnimationFrame(draw);
      this.canvasCtx.clearRect(0, 0, width, height);

      const time = this.player.currentTime || 0;
      const beatPulse = (Math.sin(time * 8) + 1) * 0.5;

      for (let i = 0; i < bars; i++) {
        const wave1 = Math.sin(time * 10 + i * 0.45);
        const wave2 = Math.cos(time * 5 - i * 0.25);
        const wave3 = Math.sin(time * 20 + i * 1.1);

        let energy = (wave1 * 0.4 + wave2 * 0.35 + wave3 * 0.25 + 1) * 0.5;

        if (this.currentMode === 'studio') {
          energy = energy * 0.85 + beatPulse * 0.35;
          const barHeight = Math.max(6, energy * height * 0.88);

          const grad = this.canvasCtx.createLinearGradient(0, height, 0, 0);
          grad.addColorStop(0, '#FF007F');
          grad.addColorStop(0.5, '#FF5E00');
          grad.addColorStop(1, '#8B5CF6');
          this.canvasCtx.fillStyle = grad;
          this.canvasCtx.fillRect(i * barWidth, height - barHeight, barWidth - 3, barHeight);
        } else {
          energy = energy * 0.55 + 0.15;
          const barHeight = Math.max(4, energy * height * 0.6);
          this.canvasCtx.fillStyle = '#71717a';
          this.canvasCtx.fillRect(i * barWidth, height - barHeight, barWidth - 3, barHeight);
        }
      }
    };

    draw();
  }

  stopVisualizer() {
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
    this.drawIdleVisualizer();
  }

  drawIdleVisualizer() {
    if (!this.canvas || !this.canvasCtx) return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    this.canvasCtx.clearRect(0, 0, width, height);
    this.canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';

    const bars = 24;
    const barWidth = width / bars;
    for (let i = 0; i < bars; i++) {
      const h = 4 + Math.sin(i * 0.5) * 6;
      this.canvasCtx.fillRect(i * barWidth, height - h, barWidth - 3, h);
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}

// Initialisation dès le chargement du document
document.addEventListener('DOMContentLoaded', () => {
  window.audioPlayer = new AudioComparisonPlayer();
});
