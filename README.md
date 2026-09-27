# Nature Chaimaa Hanafi — site vitrine
Site statique (HTML / CSS / JS, sans framework, sans backend). Structure :
```
site/
├── index.html          → page d'accueil (présentation + carte produit)
├── product-huile.html  → page dédiée du produit "Huile de soin naturelle"
├── css/style.css        → tous les styles
├── js/script.js         → sélecteur de contenance + liens WhatsApp
└── assets/
    ├── logo.png         → logo de la marque
    └── huile-hero.jpg   → photo produit (recadrée, sans les bandeaux de texte arabe)
```
## À compléter avant mise en ligne
1. **Prix** : dans `product-huile.html`, les boutons `.size-option` ont un
   attribut `data-price="Sur demande"`. Remplace-le par le vrai prix
   (ex : `data-price="120 DH"`).
2. **Numéro WhatsApp** : dans `js/script.js`, la constante
   `WHATSAPP_NUMBER` est réglée sur `212617650798` (numéro visible sur ta
   carte de visite / logo). J'ai vu un second numéro (`212603160217`) sur
   l'étiquette des flacons — confirme lequel est le bon avant publication.
3. **Instagram** : le lien `@nature_chaimaa` dans le pied de page pointe
   vers `instagram.com/nature_chaimaa`, à vérifier.
## Ajouter un nouveau produit
Comme tu es full-stack, voici le pattern à dupliquer :
1. Copie `product-huile.html` → `product-XXX.html`, change le `<h1>`,
   la description, les tailles/prix, et l'image dans `.pd-media`.
2. Dans `index.html`, duplique le bloc `<a class="product-card">` dans la
   section `#produits` et pointe le `href` vers ta nouvelle page.
3. Ajoute la photo du produit dans `assets/`.
Aucune base de données n'est nécessaire pour l'instant vu que c'est un
site vitrine (pas de panier/paiement en ligne) — la commande se fait via
WhatsApp. Si tu veux passer à plusieurs dizaines de produits, il vaudra
mieux générer les pages produit depuis un petit fichier JSON/JS plutôt que
dupliquer le HTML à la main ; dis-le moi et je peux le mettre en place.
## Sécurité (site statique, donc surface d'attaque volontairement réduite)
- **Content-Security-Policy** stricte dans le `<head>` des deux pages :
  scripts autorisés uniquement en local (`script-src 'self'`), pas
  d'iframe externe possible (`frame-ancestors 'none'`), styles/fonts
  limités à Google Fonts.
- **X-Content-Type-Options: nosniff** et **Referrer-Policy** ajoutés en
  meta tags (à dupliquer aussi côté serveur/hébergeur si possible — un
  header HTTP réel est plus fiable qu'un `<meta>`).
- Aucune clé API, mot de passe ou secret dans le code : tout est public
  (normal pour un site statique) donc n'y mets jamais d'identifiants.
- Le bouton WhatsApp construit son URL avec `encodeURIComponent` pour
  éviter toute injection dans le lien, même si le message est fixe
  aujourd'hui.
- Tous les liens externes (`target="_blank"`) ont `rel="noopener
  noreferrer"` pour éviter le "reverse tabnabbing".
- Pas de formulaire ni de champ de saisie côté client pour l'instant →
  pas de risque XSS/CSRF classique. Si tu ajoutes un formulaire de
  contact plus tard, pense à valider et échapper côté serveur, pas
  seulement en JS.
- **Important** : la vraie sécurité d'un site statique dépend surtout de
  l'hébergeur (HTTPS forcé, headers de sécurité au niveau serveur, pas
  de fichiers sensibles exposés). Le CSP en meta tag est un filet, pas
  une garantie complète.
## Lancer en local
Ouvre simplement `index.html` dans un navigateur, ou sers le dossier avec
un serveur statique (ex : `python3 -m http.server` depuis le dossier
`site/`) pour éviter les restrictions de certains navigateurs sur les
fichiers ouverts en `file://`.\n\n
