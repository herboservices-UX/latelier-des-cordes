/**
 * Le Labo des Cordes - Comparateur Audio A/B Réel
 * Permet d'écouter la différence entre la prise brute smartphone ("To The Star - Raw")
 * et la version finale mixée & masterisée au studio par Alexandre Herbin blvckbeats808 ("Flying Away")
 */

class AudioComparisonPlayer {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentMode = 'studio'; // 'smartphone' or 'studio'
    this.analyser = null;
    this.canvas = null;
    this.canvasCtx = null;
    this.animFrame = null;

    // Éléments audio HTML5 réels
    this.audioRaw = new Audio('assets/audio/smartphone-raw.m4a');
    this.audioRaw.loop = true;
    this.audioRaw.preload = 'auto';

    this.audioStudio = new Audio('assets/audio/studio-final.m4a');
    this.audioStudio.loop = true;
    this.audioStudio.preload = 'auto';

    this.gainRaw = null;
    this.gainStudio = null;
    this.sourceRaw = null;
    this.sourceStudio = null;
    this.nodesConnected = false;

    this.initDOM();
  }

  initDOM() {
    this.playBtn = document.getElementById('audio-play-btn');
    this.playIcon = document.getElementById('audio-play-icon');
    this.playText = document.getElementById('audio-play-text');
    this.modeSmartphoneBtn = document.getElementById('mode-smartphone-btn');
    this.modeStudioBtn = document.getElementById('mode-studio-btn');
    this.modeBadge = document.getElementById('audio-current-mode-badge');
    this.canvas = document.getElementById('audio-visualizer-canvas');

    if (this.canvas) {
      this.canvasCtx = this.canvas.getContext('2d');
      this.drawIdleVisualizer();
    }

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.modeSmartphoneBtn) {
      this.modeSmartphoneBtn.addEventListener('click', () => this.setMode('smartphone'));
    }

    if (this.modeStudioBtn) {
      this.modeStudioBtn.addEventListener('click', () => this.setMode('studio'));
    }

    // Gestion de la fin de piste ou pause
    this.audioRaw.addEventListener('ended', () => {
      if (this.currentMode === 'smartphone' && !this.audioRaw.loop) this.stop();
    });
    this.audioStudio.addEventListener('ended', () => {
      if (this.currentMode === 'studio' && !this.audioStudio.loop) this.stop();
    });
  }

  initAudioGraph() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;

      try {
        if (!this.nodesConnected) {
          this.sourceRaw = this.audioCtx.createMediaElementSource(this.audioRaw);
          this.sourceStudio = this.audioCtx.createMediaElementSource(this.audioStudio);

          this.gainRaw = this.audioCtx.createGain();
          this.gainStudio = this.audioCtx.createGain();

          this.sourceRaw.connect(this.gainRaw);
          this.sourceStudio.connect(this.gainStudio);

          this.gainRaw.connect(this.analyser);
          this.gainStudio.connect(this.analyser);

          this.analyser.connect(this.audioCtx.destination);
          this.nodesConnected = true;
        }
      } catch (err) {
        console.warn('MediaElementSource fallback:', err);
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.applyGains();
  }

  applyGains() {
    if (this.gainRaw && this.gainStudio && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      if (this.currentMode === 'smartphone') {
        this.gainRaw.gain.setValueAtTime(1.0, now);
        this.gainStudio.gain.setValueAtTime(0.0, now);
      } else {
        this.gainRaw.gain.setValueAtTime(0.0, now);
        this.gainStudio.gain.setValueAtTime(1.0, now);
      }
    } else {
      // Fallback direct sur le volume des éléments audio HTML5
      if (this.currentMode === 'smartphone') {
        this.audioRaw.volume = 1.0;
        this.audioStudio.volume = 0.0;
      } else {
        this.audioRaw.volume = 0.0;
        this.audioStudio.volume = 1.0;
      }
    }
  }

  setMode(mode) {
    this.currentMode = mode;

    if (this.modeSmartphoneBtn && this.modeStudioBtn) {
      if (mode === 'smartphone') {
        this.modeSmartphoneBtn.classList.add('bg-zinc-800', 'text-white', 'border-zinc-500');
        this.modeSmartphoneBtn.classList.remove('bg-transparent', 'text-zinc-400', 'border-transparent');

        this.modeStudioBtn.classList.remove('bg-gradient-to-r', 'from-pink-600', 'to-orange-500', 'text-white', 'shadow-lg');
        this.modeStudioBtn.classList.add('bg-transparent', 'text-zinc-400', 'border-transparent');

        if (this.modeBadge) {
          this.modeBadge.innerHTML = '<svg class="w-3.5 h-3.5 stroke-current fill-none shrink-0" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg><span><strong>Prise Brute</strong> (To The Star • Raw)</span>';
          this.modeBadge.className = 'text-xs px-3 py-1.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700 font-mono inline-flex items-center gap-1.5';
        }
      } else {
        this.modeStudioBtn.classList.add('bg-gradient-to-r', 'from-pink-600', 'to-orange-500', 'text-white', 'shadow-lg');
        this.modeStudioBtn.classList.remove('bg-transparent', 'text-zinc-400', 'border-transparent');

        this.modeSmartphoneBtn.classList.remove('bg-zinc-800', 'text-white', 'border-zinc-500');
        this.modeSmartphoneBtn.classList.add('bg-transparent', 'text-zinc-400', 'border-transparent');

        if (this.modeBadge) {
          this.modeBadge.innerHTML = '<svg class="w-3.5 h-3.5 fill-current text-pink-400 shrink-0" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.1-6.2-4.5-6.2 4.5 2.3-7.1-6.1-4.5h7.6z"/></svg><span><strong>Mix Studio Pro</strong> (Flying Away • Master blvckbeats808)</span>';
          this.modeBadge.className = 'text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20 text-pink-300 border border-pink-500/40 font-mono inline-flex items-center gap-1.5';
        }
      }
    }

    if (this.isPlaying) {
      // Synchronisation du temps de lecture lors de la bascule
      if (mode === 'smartphone' && this.audioStudio.duration > 0) {
        this.audioRaw.currentTime = this.audioStudio.currentTime % (this.audioRaw.duration || 24);
      } else if (mode === 'studio' && this.audioRaw.duration > 0) {
        this.audioStudio.currentTime = this.audioRaw.currentTime % (this.audioStudio.duration || 16);
      }
      this.applyGains();
    }
  }

  togglePlay() {
    this.initAudioGraph();
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this.isPlaying = true;
    if (this.playIcon) this.playIcon.innerHTML = '<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    if (this.playText) this.playText.textContent = 'Mettre en pause';

    this.applyGains();

    const p1 = this.audioRaw.play();
    const p2 = this.audioStudio.play();

    if (p1 && p1.catch) p1.catch(e => console.warn('Play raw:', e));
    if (p2 && p2.catch) p2.catch(e => console.warn('Play studio:', e));

    this.renderVisualizer();
  }

  stop() {
    this.isPlaying = false;
    if (this.playIcon) this.playIcon.innerHTML = '<svg class="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    if (this.playText) this.playText.textContent = 'Écouter le comparatif sonore';

    this.audioRaw.pause();
    this.audioStudio.pause();

    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
    }
    this.drawIdleVisualizer();
  }

  renderVisualizer() {
    if (!this.canvas) return;

    const bufferLength = (this.analyser && this.analyser.frequencyBinCount) || 32;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      this.animFrame = requestAnimationFrame(draw);

      if (this.analyser) {
        this.analyser.getByteFrequencyData(dataArray);
      }

      const width = this.canvas.width;
      const height = this.canvas.height;
      this.canvasCtx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // En cas d'écoute directe sans MediaElementSource, on simule une dynamique rythmée
        let val = dataArray[i];
        if (!val || val === 0) {
          const t = Date.now() * 0.005;
          val = 90 + Math.sin(t + i * 0.4) * 60 + Math.cos(t * 1.5 + i * 0.2) * 30;
        }

        const barHeight = (val / 255) * height * 0.9 + 4;

        if (this.currentMode === 'studio') {
          const grad = this.canvasCtx.createLinearGradient(0, height, 0, 0);
          grad.addColorStop(0, '#FF007F');
          grad.addColorStop(0.5, '#FF5E00');
          grad.addColorStop(1, '#8B5CF6');
          this.canvasCtx.fillStyle = grad;
        } else {
          this.canvasCtx.fillStyle = '#71717a';
        }

        this.canvasCtx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };

    draw();
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
}

// Initialisation dès le chargement du document
document.addEventListener('DOMContentLoaded', () => {
  window.audioPlayer = new AudioComparisonPlayer();
});
