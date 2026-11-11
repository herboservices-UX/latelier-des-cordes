# 🎸 L'Atelier des Cordes — Site Web Officiel

Site vitrine haut de gamme avec système d'acquisition, de qualification et de gestion de rareté (Mobile-First) pour l'école de guitare moderne et le studio de production d'**Alexandre Herbin (blvckbeats808 / Herbo)** à **Montpellier (Pompignane)**.

---

## ⚡ Caractéristiques Principales

- **Punchline officielle mise en avant :** *« Vos enfants sont nés pour créer, pas pour scroller. »*
- **Direction Artistique & Couleurs :** Ambiance Studio Sunset Creative & Flashy (Magenta néon `#FF007F`, Orange incandescent `#FF5E00`, Cyber Violet `#8B5CF6`, Cyan lumineux, Dark mode profond et glassmorphism).
- **Projet Signature Spotify :** Présentation du cursus trimestriel avec **Simulateur de Pochette Spotify en direct** (générateur de vinyle tournant et artwork personnalisé au prénom de l'élève).
- **Comparateur Audio A/B en direct (Web Audio API) :** Permet aux parents d'écouter la différence spectaculaire entre une prise brute smartphone et un mix studio pro spatialisé avec basse 808.
- **Levier Fiscal Services à la Personne (50%) :** Formule à domicile mise en avant à **65 €/mois** net (au lieu de 130 €) grâce à l'Avance Immédiate Urssaf / CESU.
- **Diagnostic & Casting Interactif en 5 étapes :** Formule multi-étapes valorisante avec qualification des goûts musicaux, niveau, créneaux en temps réel et **génération automatique d'un message WhatsApp prêt à envoyer au 06 16 39 26 58**.
- **Crédibilité Internationale :** Mise en avant du placement à Nashville (USA) avec lien vidéo et instrumentale de blvckbeats808.
- **Balisage SEO Local :** Schema.org JSON-LD optimisé pour Montpellier, quartier Pompignane, Castelnau-le-Lez et communes limitrophes.

---

## 🚀 Comment lancer et tester le site en local

Tu peux tester le site immédiatement sans aucune installation compliquée :

### Option 1 : Double-clic
Ouvre simplement le fichier `index.html` dans ton navigateur (Google Chrome, Safari, Firefox, Edge).

### Option 2 : Serveur local rapide avec Python (Recommandé)
Ouvre ton terminal dans le dossier et tape :
```bash
python3 -m http.server 3000
```
Puis ouvre ton navigateur sur `http://localhost:3000`.

---

## 🛠️ Comment modifier facilement les places disponibles

Pour ajuster le nombre de places restantes (ex: après avoir validé un élève) :
1. Ouvre `js/app.js`
2. Modifie simplement les valeurs dans la fonction `initQuotaIndicators()` :
```javascript
const quotas = {
  studioRemaining: 2,  // Modifie le chiffre ici
  homeRemaining: 3,    // Modifie le chiffre ici
  totalPerQuarter: 12
};
```
Tous les badges de la page se mettront à jour automatiquement.

---

## 🌐 Déploiement en ligne en 1 clic (Gratuit)

Tu peux déployer ce site en 2 minutes sur :
- **Vercel :** Glisse-dépose le dossier sur [vercel.com](https://vercel.com)
- **Netlify :** Glisse-dépose le dossier sur [app.netlify.com/drop](https://app.netlify.com/drop)
- **Hostinger / OVH :** Transfère les fichiers du dossier dans le dossier `public_html` via FTP.

---

## 📞 Coordonnées & Configuration
- **WhatsApp :** `06 16 39 26 58`
- **Email :** `blvckbeats808@gmail.com`
- **Localisation :** Quartier de la Pompignane, 34000 Montpellier
