export const wcagTranslations: Record<string, {
  title: string
  description: string
  help: string
  wcag: string
  impact: string // Ajout : explique l'impact réel
  exemples?: string[] // Ajout : exemples concrets
}> = {
  'accesskeys': {
    title: 'Raccourcis clavier (accesskey) en conflit',
    description: 'Les attributs accesskey doivent être uniques pour éviter les conflits de navigation clavier',
    help: 'Supprimez les accesskey en double ou utilisez des raccourcis différents pour chaque élément',
    wcag: 'WCAG 2.1 - 2.1.1 Clavier (Niveau A)',
    impact: 'Les utilisateurs qui naviguent au clavier ne pourront pas utiliser les raccourcis correctement',
    exemples: ['Évitez d\'avoir plusieurs boutons avec accesskey="s"']
  },
  'aria-allowed-attr': {
    title: 'Attributs ARIA non autorisés',
    description: 'Certains éléments utilisent des attributs ARIA incompatibles avec leur rôle',
    help: 'Consultez la spécification ARIA pour vérifier quels attributs sont autorisés pour chaque rôle. Par exemple, aria-placeholder n\'est valide que sur les champs de saisie',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les lecteurs d\'écran ne pourront pas interpréter correctement ces éléments',
    exemples: [
      'Évitez aria-checked sur un <div> sans role="checkbox"',
      'N\'utilisez pas aria-label sur un <div> décoratif'
    ]
  },
  'aria-command-name': {
    title: 'Commandes ARIA sans nom accessible',
    description: 'Les boutons et liens doivent avoir un nom discernable par les lecteurs d\'écran',
    help: 'Ajoutez du texte visible dans l\'élément, ou utilisez aria-label, ou aria-labelledby pour donner un nom',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les utilisateurs de lecteurs d\'écran ne sauront pas quelle action effectue ce bouton',
    exemples: [
      '<button aria-label="Fermer">✕</button>',
      '<a href="/contact">Contactez-nous</a>'
    ]
  },
  'aria-hidden-body': {
    title: 'aria-hidden sur <body>',
    description: 'L\'attribut aria-hidden="true" ne doit jamais être placé sur l\'élément <body>',
    help: 'Supprimez aria-hidden="true" de la balise <body>. Cela masque tout le contenu de la page aux lecteurs d\'écran',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'La page entière sera invisible pour les utilisateurs de lecteurs d\'écran',
  },
  'aria-hidden-focus': {
    title: 'Éléments focusables cachés avec aria-hidden',
    description: 'Des éléments interactifs sont masqués avec aria-hidden="true" mais restent accessibles au clavier',
    help: 'Soit rendez l\'élément non focusable (tabindex="-1"), soit retirez aria-hidden. Un élément ne peut pas être à la fois masqué et focusable',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les utilisateurs naviguant au clavier pourront focus des éléments invisibles, créant de la confusion',
  },
  'aria-input-field-name': {
    title: 'Champs de saisie ARIA sans nom',
    description: 'Les champs de formulaire avec rôle ARIA doivent avoir un nom accessible',
    help: 'Ajoutez un <label>, aria-label ou aria-labelledby pour identifier le champ',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les utilisateurs ne sauront pas quelle information saisir dans ce champ',
    exemples: [
      '<div role="textbox" aria-label="Nom complet"></div>',
      '<label for="email">Email</label><input id="email" type="email">'
    ]
  },
  'aria-meter-name': {
    title: 'Jauges ARIA sans nom',
    description: 'Les éléments avec role="meter" doivent avoir un nom accessible',
    help: 'Ajoutez aria-label ou aria-labelledby pour décrire ce que mesure la jauge',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les utilisateurs ne comprendront pas ce que représente cette jauge',
    exemples: ['<div role="meter" aria-label="Batterie restante" aria-valuenow="75"></div>']
  },
  'aria-progressbar-name': {
    title: 'Barres de progression ARIA sans nom',
    description: 'Les barres de progression doivent avoir un nom qui décrit le processus',
    help: 'Ajoutez aria-label pour identifier ce qui progresse (ex: "Téléchargement en cours")',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les utilisateurs ne sauront pas ce qui est en cours de chargement',
    exemples: ['<div role="progressbar" aria-label="Téléchargement du fichier" aria-valuenow="50"></div>']
  },
  'aria-required-attr': {
    title: 'Attributs ARIA requis manquants',
    description: 'Certains rôles ARIA nécessitent des attributs obligatoires qui ne sont pas présents',
    help: 'Ajoutez tous les attributs requis pour le rôle utilisé. Par exemple, role="slider" nécessite aria-valuenow, aria-valuemin et aria-valuemax',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les lecteurs d\'écran ne pourront pas annoncer l\'état correct de l\'élément',
    exemples: [
      'role="checkbox" nécessite aria-checked',
      'role="slider" nécessite aria-valuenow, aria-valuemin, aria-valuemax'
    ]
  },
  'aria-required-children': {
    title: 'Enfants ARIA requis manquants',
    description: 'Certains rôles ARIA nécessitent des rôles enfants spécifiques',
    help: 'Vérifiez la hiérarchie ARIA requise. Par exemple, role="list" doit contenir des éléments avec role="listitem"',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'La structure sémantique sera incorrecte pour les technologies d\'assistance',
    exemples: [
      '<ul role="list"><li role="listitem">Item 1</li></ul>',
      '<div role="radiogroup"><div role="radio">Option A</div></div>'
    ]
  },
  'aria-required-parent': {
    title: 'Parent ARIA requis manquant',
    description: 'Certains rôles ARIA doivent être contenus dans un parent spécifique',
    help: 'Assurez-vous que l\'élément est dans le bon contexte. Par exemple, role="listitem" doit être dans un role="list"',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les lecteurs d\'écran ne pourront pas comprendre la structure',
    exemples: [
      '<li> doit être dans <ul> ou <ol>',
      'role="option" doit être dans role="listbox"'
    ]
  },
  'aria-roles': {
    title: 'Rôles ARIA invalides ou mal orthographiés',
    description: 'Certains rôles ARIA utilisés n\'existent pas dans la spécification',
    help: 'Vérifiez l\'orthographe et utilisez uniquement des rôles ARIA valides listés dans la documentation WAI-ARIA',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Le rôle sera ignoré et l\'élément n\'aura pas le comportement attendu',
    exemples: [
      'Utilisez role="button" et non role="btn"',
      'Utilisez role="navigation" et non role="nav"'
    ]
  },
  'aria-toggle-field-name': {
    title: 'Champs à bascule ARIA sans nom',
    description: 'Les switches, checkboxes et radio ARIA doivent avoir un nom accessible',
    help: 'Ajoutez aria-label ou aria-labelledby pour identifier l\'option',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les utilisateurs ne sauront pas quelle option ils activent/désactivent',
    exemples: ['<div role="switch" aria-label="Mode sombre" aria-checked="false"></div>']
  },
  'aria-tooltip-name': {
    title: 'Info-bulles ARIA sans nom',
    description: 'Les éléments avec role="tooltip" doivent avoir un nom accessible',
    help: 'Ajoutez du contenu textuel ou aria-label pour décrire le tooltip',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Le contenu du tooltip ne sera pas annoncé correctement',
  },
  'aria-treeitem-name': {
    title: 'Éléments d\'arborescence ARIA sans nom',
    description: 'Les éléments avec role="treeitem" doivent avoir un nom accessible',
    help: 'Ajoutez du texte visible ou aria-label pour identifier l\'élément dans l\'arbre',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les utilisateurs ne sauront pas quel élément de l\'arbre ils naviguent',
  },
  'aria-valid-attr-value': {
    title: 'Valeurs d\'attributs ARIA invalides',
    description: 'Certains attributs ARIA ont des valeurs qui ne respectent pas le format attendu',
    help: 'Corrigez les valeurs selon la spécification. Par exemple, aria-checked accepte "true", "false" ou "mixed", pas "yes" ou "1"',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les valeurs incorrectes seront ignorées par les technologies d\'assistance',
    exemples: [
      'aria-checked="true" ✓ (pas aria-checked="1")',
      'aria-expanded="false" ✓ (pas aria-expanded="no")'
    ]
  },
  'aria-valid-attr': {
    title: 'Attributs ARIA inexistants',
    description: 'Certains attributs ARIA utilisés n\'existent pas dans la spécification',
    help: 'Vérifiez l\'orthographe des attributs ARIA. Consultez la liste officielle sur w3.org/WAI/ARIA',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les attributs invalides seront ignorés',
    exemples: [
      'Utilisez aria-label et non aria-name',
      'Utilisez aria-describedby et non aria-description'
    ]
  },
  'button-name': {
    title: 'Boutons sans nom accessible',
    description: 'Des boutons n\'ont pas de texte ou d\'attribut qui les identifie',
    help: 'Ajoutez du texte visible dans le bouton, ou un aria-label, ou un title',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les utilisateurs ne sauront pas quelle action effectue le bouton',
    exemples: [
      '<button>Valider</button>',
      '<button aria-label="Fermer la fenêtre">✕</button>',
      '<button><span class="sr-only">Menu</span>☰</button>'
    ]
  },
  'bypass': {
    title: 'Absence de mécanisme pour éviter les blocs de contenu répétés',
    description: 'La page devrait avoir un lien "Aller au contenu principal" pour sauter la navigation',
    help: 'Ajoutez un lien invisible (visible au focus) en début de page qui pointe vers le contenu principal avec un id',
    wcag: 'WCAG 2.1 - 2.4.1 Contourner des blocs (Niveau A)',
    impact: 'Les utilisateurs au clavier devront passer par tous les liens de navigation à chaque page',
    exemples: [
      '<a href="#main" class="skip-link">Aller au contenu</a>',
      '<main id="main">Contenu ici</main>'
    ]
  },
  'color-contrast': {
    title: 'Contraste de couleur insuffisant',
    description: 'Le texte n\'a pas un contraste suffisant avec son arrière-plan pour être lisible',
    help: 'Augmentez le contraste pour atteindre au minimum un ratio de 4.5:1 pour le texte normal et 3:1 pour le texte large (18pt+ ou 14pt+ gras)',
    wcag: 'WCAG 2.1 - 1.4.3 Contraste minimum (Niveau AA)',
    impact: 'Les personnes malvoyantes ou avec des déficiences visuelles ne pourront pas lire le contenu',
    exemples: [
      'Texte #777 sur fond #FFF : ratio 4.5:1 ✓',
      'Texte #999 sur fond #FFF : ratio 2.8:1 ✗'
    ]
  },
  'definition-list': {
    title: 'Liste de définitions mal structurée',
    description: 'Les <dl> doivent contenir uniquement des <dt> (termes) et <dd> (définitions)',
    help: 'Assurez-vous que vos listes de définitions ne contiennent pas d\'autres éléments directs. Placez le contenu additionnel dans les <dd>',
    wcag: 'WCAG 2.1 - 1.3.1 Information et relations (Niveau A)',
    impact: 'La structure sémantique sera incorrecte pour les lecteurs d\'écran',
    exemples: [
      '<dl><dt>Terme</dt><dd>Définition</dd></dl> ✓',
      '<dl><dt>Terme</dt><p>Texte</p></dl> ✗'
    ]
  },
  'dlitem': {
    title: 'Éléments <dt> et <dd> en dehors d\'une liste de définitions',
    description: 'Les balises <dt> et <dd> doivent être placées dans une balise <dl>',
    help: 'Enveloppez vos <dt> et <dd> dans un élément <dl> parent',
    wcag: 'WCAG 2.1 - 1.3.1 Information et relations (Niveau A)',
    impact: 'La sémantique sera perdue et les lecteurs d\'écran ne pourront pas associer termes et définitions',
  },
  'document-title': {
    title: 'Page sans titre ou titre vide',
    description: 'Chaque page HTML doit avoir un élément <title> unique et descriptif dans le <head>',
    help: 'Ajoutez <title>Description de la page - Nom du site</title> dans le <head>',
    wcag: 'WCAG 2.1 - 2.4.2 Titre de page (Niveau A)',
    impact: 'Les utilisateurs ne pourront pas identifier la page dans l\'historique, les favoris ou les onglets',
    exemples: [
      '<title>Accueil - Ma Boutique</title>',
      '<title>Contact | Entreprise XYZ</title>'
    ]
  },
  'duplicate-id-active': {
    title: 'IDs dupliqués sur des éléments interactifs',
    description: 'Plusieurs éléments focusables (liens, boutons) partagent le même ID',
    help: 'Assurez-vous que chaque ID est unique sur la page. Les IDs dupliqués cassent les associations ARIA et les liens internes',
    wcag: 'WCAG 2.1 - 4.1.1 Analyse syntaxique (Niveau A)',
    impact: 'Les liens internes et les labels associés par ID ne fonctionneront pas correctement',
  },
  'duplicate-id-aria': {
    title: 'IDs dupliqués référencés par ARIA',
    description: 'Des attributs ARIA (aria-labelledby, aria-describedby) pointent vers des IDs en double',
    help: 'Rendez chaque ID unique. Les lecteurs d\'écran ne sauront pas quel élément utiliser',
    wcag: 'WCAG 2.1 - 4.1.1 Analyse syntaxique (Niveau A)',
    impact: 'Les associations ARIA ne fonctionneront pas correctement',
  },
  'form-field-multiple-labels': {
    title: 'Champs de formulaire avec plusieurs labels',
    description: 'Un même champ a plusieurs éléments <label> qui lui sont associés',
    help: 'Utilisez un seul <label> par champ. Si vous avez besoin de texte additionnel, utilisez aria-describedby',
    wcag: 'WCAG 2.1 - 3.3.2 Étiquettes ou instructions (Niveau A)',
    impact: 'Les lecteurs d\'écran annonceront plusieurs labels, créant de la confusion',
    exemples: [
      '<label for="email">Email</label><input id="email">',
      '<label for="tel">Téléphone</label><input id="tel" aria-describedby="tel-hint"><p id="tel-hint">Format: 06...</p>'
    ]
  },
  'frame-title': {
    title: 'Frames et iframes sans titre',
    description: 'Les éléments <iframe> doivent avoir un attribut title descriptif',
    help: 'Ajoutez title="Description du contenu de l\'iframe" à tous vos iframes',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les utilisateurs ne sauront pas quel contenu est chargé dans l\'iframe',
    exemples: [
      '<iframe src="map.html" title="Carte interactive de notre localisation"></iframe>',
      '<iframe src="video.html" title="Vidéo de présentation du produit"></iframe>'
    ]
  },
  'heading-order': {
    title: 'Ordre des titres (h1-h6) incorrect',
    description: 'La hiérarchie des titres saute des niveaux (ex: h1 puis h3 sans h2)',
    help: 'Respectez l\'ordre logique : h1 → h2 → h3, etc. Ne sautez pas de niveau pour des raisons de style (utilisez CSS à la place)',
    wcag: 'WCAG 2.1 - 1.3.1 Information et relations (Niveau A)',
    impact: 'Les utilisateurs de lecteurs d\'écran utilisent les titres pour naviguer. Un ordre incorrect rend la structure confuse',
    exemples: [
      'h1 (Titre principal) → h2 (Section) → h3 (Sous-section) ✓',
      'h1 → h3 (saute h2) ✗'
    ]
  },
  'html-has-lang': {
    title: 'Élément <html> sans attribut lang',
    description: 'La balise <html> doit spécifier la langue principale de la page',
    help: 'Ajoutez lang="fr" (ou autre code langue) à la balise <html>',
    wcag: 'WCAG 2.1 - 3.1.1 Langue de la page (Niveau A)',
    impact: 'Les lecteurs d\'écran ne pourront pas choisir la bonne prononciation et les traducteurs automatiques ne fonctionneront pas correctement',
    exemples: [
      '<html lang="fr"> pour une page en français',
      '<html lang="en"> pour une page en anglais'
    ]
  },
  'html-lang-valid': {
    title: 'Attribut lang avec un code de langue invalide',
    description: 'Le code de langue utilisé dans lang n\'est pas conforme à la norme BCP 47',
    help: 'Utilisez des codes de langue valides : "fr" (français), "en" (anglais), "es" (espagnol), "de" (allemand), etc.',
    wcag: 'WCAG 2.1 - 3.1.1 Langue de la page (Niveau A)',
    impact: 'Les technologies d\'assistance ne pourront pas identifier la langue',
    exemples: [
      'lang="fr" ✓ (pas lang="francais")',
      'lang="en-US" ✓ (anglais américain)',
      'lang="zh-Hans" ✓ (chinois simplifié)'
    ]
  },
  'image-alt': {
    title: 'Images sans texte alternatif',
    description: 'Des images n\'ont pas d\'attribut alt pour décrire leur contenu',
    help: 'Ajoutez alt="Description de l\'image" pour les images informatives, ou alt="" pour les images décoratives',
    wcag: 'WCAG 2.1 - 1.1.1 Contenu non textuel (Niveau A)',
    impact: 'Les utilisateurs aveugles ou malvoyants ne sauront pas ce que représente l\'image',
    exemples: [
      '<img src="logo.png" alt="Logo de l\'entreprise ABC">',
      '<img src="decoration.png" alt=""> pour une image purement décorative',
      '<img src="graph.png" alt="Graphique montrant une augmentation de 25% des ventes en 2024">'
    ]
  },
  'input-image-alt': {
    title: 'Boutons image (<input type="image">) sans texte alternatif',
    description: 'Les inputs de type image doivent avoir un attribut alt descriptif',
    help: 'Ajoutez alt="Texte du bouton" à tous vos <input type="image">',
    wcag: 'WCAG 2.1 - 1.1.1 Contenu non textuel (Niveau A)',
    impact: 'Les utilisateurs ne sauront pas quelle action effectue ce bouton',
    exemples: ['<input type="image" src="submit.png" alt="Envoyer le formulaire">']
  },
  'label': {
    title: 'Champs de formulaire sans label',
    description: 'Des éléments de formulaire (input, select, textarea) n\'ont pas de label associé',
    help: 'Ajoutez un <label> avec un attribut for correspondant à l\'id du champ, ou utilisez aria-label',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A) + 3.3.2 Étiquettes (Niveau A)',
    impact: 'Les utilisateurs ne sauront pas quelle information saisir dans le champ',
    exemples: [
      '<label for="nom">Nom complet</label><input id="nom" type="text">',
      '<input type="email" aria-label="Adresse email">',
      '<label>Prénom <input type="text"></label> (label englobant)'
    ]
  },
  'link-name': {
    title: 'Liens sans nom accessible',
    description: 'Des liens <a> n\'ont pas de texte discernable par les lecteurs d\'écran',
    help: 'Ajoutez du texte visible dans le lien, ou un aria-label, ou un title. Évitez les liens vides ou avec uniquement des icônes sans texte',
    wcag: 'WCAG 2.1 - 2.4.4 Fonction du lien (Niveau A) + 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les utilisateurs ne sauront pas où mène ce lien',
    exemples: [
      '<a href="/contact">Contactez-nous</a>',
      '<a href="/profil" aria-label="Mon profil"><i class="icon-user"></i></a>',
      '<a href="/aide"><span class="sr-only">Aide</span>?</a>'
    ]
  },
  'list': {
    title: 'Structure de liste incorrecte',
    description: 'Des éléments <li> ne sont pas contenus dans <ul>, <ol> ou <menu>',
    help: 'Enveloppez vos <li> dans une balise <ul> (liste non ordonnée) ou <ol> (liste ordonnée)',
    wcag: 'WCAG 2.1 - 1.3.1 Information et relations (Niveau A)',
    impact: 'La sémantique de liste sera perdue pour les lecteurs d\'écran',
    exemples: [
      '<ul><li>Item 1</li><li>Item 2</li></ul> ✓',
      '<div><li>Item</li></div> ✗'
    ]
  },
  'listitem': {
    title: 'Éléments <li> en dehors d\'une liste',
    description: 'Des balises <li> sont utilisées sans être dans <ul> ou <ol>',
    help: 'Placez vos <li> uniquement dans des balises <ul> ou <ol>',
    wcag: 'WCAG 2.1 - 1.3.1 Information et relations (Niveau A)',
    impact: 'Les lecteurs d\'écran ne pourront pas annoncer correctement le nombre d\'éléments',
  },
  'meta-refresh': {
    title: 'Rafraîchissement automatique de la page',
    description: 'La page utilise <meta http-equiv="refresh"> pour se recharger automatiquement',
    help: 'Supprimez les méta refresh ou utilisez une valeur supérieure à 20 heures. Préférez JavaScript avec contrôle utilisateur',
    wcag: 'WCAG 2.1 - 2.2.1 Réglage du délai (Niveau A) + 3.2.5 Changement à la demande (Niveau AAA)',
    impact: 'Les utilisateurs perdront leur progression et les lecteurs d\'écran seront interrompus',
  },
  'meta-viewport': {
    title: 'Viewport mal configuré (zoom désactivé)',
    description: 'La balise meta viewport empêche le zoom avec user-scalable=no ou maximum-scale<5',
    help: 'Supprimez user-scalable=no et maximum-scale<5. Laissez les utilisateurs zoomer jusqu\'à 200%',
    wcag: 'WCAG 2.1 - 1.4.4 Redimensionnement du texte (Niveau AA)',
    impact: 'Les utilisateurs malvoyants ne pourront pas agrandir le texte',
    exemples: [
      '<meta name="viewport" content="width=device-width, initial-scale=1"> ✓',
      '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"> ✗'
    ]
  },
  'object-alt': {
    title: 'Objets multimédias sans alternative textuelle',
    description: 'Les éléments <object> n\'ont pas de contenu textuel alternatif',
    help: 'Ajoutez du texte descriptif entre les balises <object> qui sera affiché si l\'objet ne charge pas',
    wcag: 'WCAG 2.1 - 1.1.1 Contenu non textuel (Niveau A)',
    impact: 'Les utilisateurs ne sauront pas quel contenu devrait être affiché',
    exemples: ['<object data="video.mp4">Description de la vidéo ou contenu alternatif</object>']
  },
  'select-name': {
    title: 'Menus déroulants (<select>) sans label',
    description: 'Des éléments <select> n\'ont pas de label associé',
    help: 'Ajoutez un <label> avec for correspondant à l\'id du select, ou utilisez aria-label',
    wcag: 'WCAG 2.1 - 4.1.2 Nom, rôle et valeur (Niveau A)',
    impact: 'Les utilisateurs ne sauront pas quelle option choisir',
    exemples: [
      '<label for="pays">Pays</label><select id="pays">...</select>',
      '<select aria-label="Choisir une langue">...</select>'
    ]
  },
  'tabindex': {
    title: 'Valeurs tabindex supérieures à 0',
    description: 'Des éléments utilisent tabindex avec des valeurs positives, perturbant l\'ordre de navigation',
    help: 'Utilisez uniquement tabindex="0" (ordre naturel) ou tabindex="-1" (non focusable). Ne jamais utiliser de valeurs positives',
    wcag: 'WCAG 2.1 - 2.4.3 Parcours du focus (Niveau A)',
    impact: 'L\'ordre de navigation au clavier sera illogique et confus',
    exemples: [
      'tabindex="0" ✓ (élément focusable dans l\'ordre naturel)',
      'tabindex="-1" ✓ (élément non focusable au clavier)',
      'tabindex="5" ✗ (évitez absolument)'
    ]
  },
  'td-headers-attr': {
    title: 'Attributs headers sur <td> incorrects',
    description: 'Des cellules de tableau utilisent l\'attribut headers avec des IDs invalides',
    help: 'Assurez-vous que les IDs dans headers correspondent à des éléments <th> existants',
    wcag: 'WCAG 2.1 - 1.3.1 Information et relations (Niveau A)',
    impact: 'Les associations entre cellules et en-têtes seront perdues',
  },
  'th-has-data-cells': {
    title: 'En-têtes de tableau sans cellules de données',
    description: 'Des éléments <th> ne sont pas associés à des cellules <td>',
    help: 'Vérifiez la structure de votre tableau. Chaque <th> doit avoir des <td> correspondants',
    wcag: 'WCAG 2.1 - 1.3.1 Information et relations (Niveau A)',
    impact: 'La structure du tableau sera incohérente',
  },
  'valid-lang': {
    title: 'Attributs lang avec codes invalides',
    description: 'Des attributs lang contiennent des codes de langue qui ne sont pas conformes à BCP 47',
    help: 'Utilisez des codes de langue valides selon la norme ISO 639-1',
    wcag: 'WCAG 2.1 - 3.1.2 Langue d\'un passage (Niveau AA)',
    impact: 'Les lecteurs d\'écran ne pourront pas prononcer correctement le texte',
    exemples: [
      '<span lang="en">Hello</span> ✓',
      '<span lang="english">Hello</span> ✗'
    ]
  },
  'video-caption': {
    title: 'Vidéos sans sous-titres',
    description: 'Les éléments <video> n\'ont pas de piste de sous-titres',
    help: 'Ajoutez <track kind="captions" src="subtitles.vtt" srclang="fr" label="Français"> dans votre élément video',
    wcag: 'WCAG 2.1 - 1.2.2 Sous-titres (pré-enregistrés) (Niveau A)',
    impact: 'Les personnes sourdes ou malentendantes ne pourront pas comprendre le contenu de la vidéo',
    exemples: [
      '<video src="video.mp4"><track kind="captions" src="fr.vtt" srclang="fr" label="Français"></video>'
    ]
  }
}

export function getTranslatedViolation(auditId: string, defaultData: any) {
  const translation = wcagTranslations[auditId]
  
  if (!translation) {
    // Fallback pour les audits non traduits
    return {
      id: auditId,
      title: defaultData.title || auditId,
      description: defaultData.description || 'Problème d\'accessibilité détecté',
      help: 'Consultez la documentation WCAG 2.1 pour plus d\'informations sur ce critère',
      wcag: 'WCAG 2.1',
      impact: 'Impact sur l\'accessibilité',
      exemples: []
    }
  }
  
  return {
    id: auditId,
    ...translation
  }
}
