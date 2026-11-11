/**
 * L'Atelier des Cordes - Comparateur Audio A/B
 * Permet d'écouter la différence entre une prise brute smartphone et le mix studio pro
 * Utilise la Web Audio API pour synthétiser un riff de guitare moderne et son beat 808
 */

class AudioComparisonPlayer {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentMode = 'studio'; // 'smartphone' or 'studio'
    this.intervalId = null;
    this.chordStep = 0;
    this.analyser = null;
    this.canvas = null;
    this.canvasCtx = null;
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
    this.canvas = document.getElementById('audio-visualizer-canvas');

    if (this.canvas) {
      this.canvasCtx = this.canvas.getContext('2d');
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
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
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
          this.modeBadge.innerHTML = '📱 <strong>Prise Smartphone</strong> (Son brut, étouffé, chambre)';
          this.modeBadge.className = 'text-xs px-3 py-1.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700 font-mono inline-block';
        }
      } else {
        this.modeStudioBtn.classList.add('bg-gradient-to-r', 'from-pink-600', 'to-orange-500', 'text-white', 'shadow-lg');
        this.modeStudioBtn.classList.remove('bg-transparent', 'text-zinc-400', 'border-transparent');

        this.modeSmartphoneBtn.classList.remove('bg-zinc-800', 'text-white', 'border-zinc-500');
        this.modeSmartphoneBtn.classList.add('bg-transparent', 'text-zinc-400', 'border-transparent');

        if (this.modeBadge) {
          this.modeBadge.innerHTML = '✨ <strong>Mix Studio Pro</strong> (Mixé par Alexandre Herbin blvckbeats808)';
          this.modeBadge.className = 'text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20 text-pink-300 border border-pink-500/40 font-mono inline-block';
        }
      }
    }
  }

  togglePlay() {
    this.initAudioContext();
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this.isPlaying = true;
    if (this.playIcon) this.playIcon.innerHTML = '⏸';
    if (this.playText) this.playText.textContent = 'Mettre en pause';
    this.chordStep = 0;
    this.playChordPattern();
    this.intervalId = setInterval(() => this.playChordPattern(), 1600);
    this.renderVisualizer();
  }

  stop() {
    this.isPlaying = false;
    if (this.playIcon) this.playIcon.innerHTML = '▶';
    if (this.playText) this.playText.textContent = 'Écouter le comparatif';
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
    }
    this.drawIdleVisualizer();
  }

  playChordPattern() {
    if (!this.audioCtx || !this.isPlaying) return;

    // Progression d'accords mélodiques modernes (Em9 -> Cmaj7 -> G -> Dsus4)
    const chordProgressions = [
      [164.81, 246.94, 329.63, 392.00, 493.88], // Em9
      [130.81, 196.00, 246.94, 329.63, 392.00], // Cmaj7
      [196.00, 246.94, 293.66, 392.00, 587.33], // G
      [146.83, 220.00, 293.66, 392.00, 440.00]  // Dsus4
    ];

    const currentNotes = chordProgressions[this.chordStep % chordProgressions.length];
    this.chordStep++;

    const now = this.audioCtx.currentTime;

    // Arpèges de guitare
    currentNotes.forEach((freq, idx) => {
      this.playGuitarPluck(freq, now + idx * 0.12, this.currentMode === 'studio');
    });

    // En mode Studio : on ajoute une basse 808 chaude et un beat trap/lofi acoustique
    if (this.currentMode === 'studio') {
      const rootFreq = currentNotes[0] / 2;
      this.play808Sub(rootFreq, now);
      this.playSnare(now + 0.8);
      this.playHiHat(now + 0.4);
      this.playHiHat(now + 1.2);
    }
  }

  playGuitarPluck(freq, time, isStudio) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = isStudio ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    // Filter to simulate guitar body resonance
    const filter = this.audioCtx.createBiquadFilter();
    if (isStudio) {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, time);
      filter.frequency.exponentialRampToValueAtTime(800, time + 0.8);
      filter.Q.value = 3.5;

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.25, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);
    } else {
      // Smartphone simulation: bandpass éthéré, boîte de conserve, résonance métallique
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, time);
      filter.Q.value = 1.2;

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.7);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyser);

    osc.start(time);
    osc.stop(time + 1.3);
  }

  play808Sub(freq, time) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.5, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.8, time + 0.15);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.9);

    osc.connect(gain);
    gain.connect(this.analyser);

    osc.start(time);
    osc.stop(time + 1.0);
  }

  playSnare(time) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
    osc.connect(gain);
    gain.connect(this.analyser);
    osc.start(time);
    osc.stop(time + 0.16);
  }

  playHiHat(time) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'highpass' in osc ? 'highpass' : 'sine';
    osc.frequency.setValueAtTime(6000, time);
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    osc.connect(gain);
    gain.connect(this.analyser);
    osc.start(time);
    osc.stop(time + 0.06);
  }

  renderVisualizer() {
    if (!this.canvas || !this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      this.animFrame = requestAnimationFrame(draw);
      this.analyser.getByteFrequencyData(dataArray);

      const width = this.canvas.width;
      const height = this.canvas.height;
      this.canvasCtx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.9 + 4;

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
