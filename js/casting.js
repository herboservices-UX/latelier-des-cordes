/**
 * L'Atelier des Cordes - Casting & Qualification Funnel
 * Gestion du formulaire multi-étapes, génération automatique WhatsApp & Email
 */

class CastingFunnel {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.formData = {
      childName: '',
      childAge: '11',
      level: 'Débutant complet',
      genres: [],
      favoriteArtists: '',
      formula: 'studio',
      postalCode: '',
      slot: 'Samedi matin (1 créneau)',
      parentName: '',
      phone: '',
      email: '',
      message: ''
    };

    this.initDOM();
  }

  initDOM() {
    this.container = document.getElementById('casting-funnel-container');
    if (!this.container) return;

    this.prevBtn = document.getElementById('funnel-prev-btn');
    this.nextBtn = document.getElementById('funnel-next-btn');
    this.submitBtn = document.getElementById('funnel-submit-btn');
    this.stepIndicator = document.getElementById('funnel-step-indicator');
    this.progressBar = document.getElementById('funnel-progress-bar');

    // Genre buttons
    const genreButtons = document.querySelectorAll('.genre-tag-btn');
    genreButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const genre = btn.getAttribute('data-genre');
        if (btn.classList.contains('active-genre')) {
          btn.classList.remove('active-genre', 'bg-gradient-to-r', 'from-pink-500', 'to-orange-500', 'text-white', 'border-transparent');
          btn.classList.add('bg-zinc-800/80', 'text-zinc-300', 'border-zinc-700');
          this.formData.genres = this.formData.genres.filter(g => g !== genre);
        } else {
          btn.classList.add('active-genre', 'bg-gradient-to-r', 'from-pink-500', 'to-orange-500', 'text-white', 'border-transparent');
          btn.classList.remove('bg-zinc-800/80', 'text-zinc-300', 'border-zinc-700');
          this.formData.genres.push(genre);
        }
      });
    });

    // Formula radio buttons
    const formulaCards = document.querySelectorAll('.formula-selector-card');
    formulaCards.forEach(card => {
      card.addEventListener('click', () => {
        formulaCards.forEach(c => {
          c.classList.remove('border-pink-500', 'bg-pink-500/10');
          c.classList.add('border-zinc-700/80', 'bg-zinc-900/50');
        });
        card.classList.add('border-pink-500', 'bg-pink-500/10');
        card.classList.remove('border-zinc-700/80', 'bg-zinc-900/50');
        
        const formula = card.getAttribute('data-formula');
        this.formData.formula = formula;

        const homeAddressBox = document.getElementById('funnel-home-address-box');
        if (homeAddressBox) {
          if (formula === 'domicile') {
            homeAddressBox.classList.remove('hidden');
          } else {
            homeAddressBox.classList.add('hidden');
          }
        }
      });
    });

    // Slot radio buttons
    const slotRadios = document.querySelectorAll('input[name="preferred-slot"]');
    slotRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.formData.slot = e.target.value;
      });
    });

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextStep());
    }
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevStep());
    }
    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submitForm();
      });
    }

    this.updateStepView();
  }

  nextStep() {
    if (!this.validateCurrentStep()) return;

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateStepView();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepView();
    }
  }

  validateCurrentStep() {
    if (this.currentStep === 1) {
      const childName = document.getElementById('funnel-child-name')?.value.trim();
      const childAge = document.getElementById('funnel-child-age')?.value;
      const level = document.getElementById('funnel-child-level')?.value;

      if (!childName) {
        alert('Veuillez indiquer le prénom de votre enfant.');
        return false;
      }
      this.formData.childName = childName;
      this.formData.childAge = childAge;
      this.formData.level = level;
    }

    if (this.currentStep === 2) {
      const artists = document.getElementById('funnel-artists')?.value.trim();
      this.formData.favoriteArtists = artists || 'Non spécifié';
    }

    if (this.currentStep === 3) {
      if (this.formData.formula === 'domicile') {
        const postal = document.getElementById('funnel-postal-code')?.value.trim();
        if (!postal) {
          alert('Veuillez indiquer votre code postal ou commune (Montpellier et métropole).');
          return false;
        }
        this.formData.postalCode = postal;
      }
    }

    return true;
  }

  updateStepView() {
    for (let i = 1; i <= this.totalSteps; i++) {
      const stepElem = document.getElementById(`funnel-step-${i}`);
      if (stepElem) {
        if (i === this.currentStep) {
          stepElem.classList.remove('hidden');
        } else {
          stepElem.classList.add('hidden');
        }
      }
    }

    if (this.stepIndicator) {
      this.stepIndicator.textContent = `Étape ${this.currentStep} sur ${this.totalSteps}`;
    }

    if (this.progressBar) {
      const pct = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
      this.progressBar.style.width = `${Math.max(10, pct)}%`;
    }

    // Toggle button visibility
    if (this.prevBtn) {
      if (this.currentStep === 1) {
        this.prevBtn.classList.add('invisible');
      } else {
        this.prevBtn.classList.remove('invisible');
      }
    }

    if (this.nextBtn && this.submitBtn) {
      if (this.currentStep === this.totalSteps) {
        this.nextBtn.classList.add('hidden');
        this.submitBtn.classList.remove('hidden');
      } else {
        this.nextBtn.classList.remove('hidden');
        this.submitBtn.classList.add('hidden');
      }
    }
  }

  submitForm() {
    const parentName = document.getElementById('funnel-parent-name')?.value.trim();
    const phone = document.getElementById('funnel-parent-phone')?.value.trim();
    const email = document.getElementById('funnel-parent-email')?.value.trim();
    const message = document.getElementById('funnel-parent-notes')?.value.trim();
    const consent = document.getElementById('funnel-consent')?.checked;

    if (!parentName || !phone || !email) {
      alert('Veuillez remplir vos coordonnées (Nom, Téléphone et E-mail).');
      return;
    }

    if (!consent) {
      alert('Veuillez accepter d’être recontacté pour valider le cours d’essai.');
      return;
    }

    this.formData.parentName = parentName;
    this.formData.phone = phone;
    this.formData.email = email;
    this.formData.message = message;

    // Construction du message WhatsApp prêt à envoyer
    const genresStr = this.formData.genres.length > 0 ? this.formData.genres.join(', ') : 'Ouvert à tout';
    const formulaStr = this.formData.formula === 'studio' ? 'En Studio (Montpellier Pompignane)' : `À Domicile (${this.formData.postalCode})`;
    
    const waText = encodeURIComponent(
      `🎸 *Candidature Cours d'essai - L'Atelier des Cordes*\n\n` +
      `👤 *Parent :* ${this.formData.parentName}\n` +
      `📞 *Tél :* ${this.formData.phone}\n` +
      `✉️ *Email :* ${this.formData.email}\n\n` +
      `👦 *Élève :* ${this.formData.childName} (${this.formData.childAge} ans)\n` +
      `🎯 *Niveau :* ${this.formData.level}\n` +
      `🎧 *Univers musical :* ${genresStr} (Artistes: ${this.formData.favoriteArtists})\n` +
      `📍 *Formule :* ${formulaStr}\n` +
      `⏰ *Créneau souhaité :* ${this.formData.slot}\n` +
      (this.formData.message ? `📝 *Note :* ${this.formData.message}\n\n` : '\n') +
      `_Envoyé depuis le site atelierdescordes.fr_`
    );

    const waUrl = `https://wa.me/33616392658?text=${waText}`;

    // Afficher l'écran de succès
    const successBox = document.getElementById('funnel-success-box');
    const formBox = document.getElementById('funnel-form-content');
    if (successBox && formBox) {
      formBox.classList.add('hidden');
      successBox.classList.remove('hidden');

      const waBtn = document.getElementById('funnel-wa-direct-btn');
      if (waBtn) {
        waBtn.href = waUrl;
      }
    }

    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(waUrl, '_blank');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.castingFunnel = new CastingFunnel();
});
