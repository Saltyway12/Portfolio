/**
 * Classe Slider - Application de diaporama d'images
 * Cette classe encapsule toutes les fonctionnalités d'un slider d'images
 * avec navigation par points et boutons
 */
export class Slider {
	/**
	 * Constructeur de l'application Slider
	 * @param {Object} options - Options de configuration
	 * @param {HTMLElement} options.container - Élément HTML qui contiendra l'application
	 * @param {Array<String>} [options.images] - Tableau optionnel des URLs d'images
	 */
	constructor(options) {
		// Récupération du conteneur
		this.container = options.container;
		if (!this.container) {
			console.error("Conteneur non spécifié pour l'application Slider");
			return;
		}

		// Images par défaut si aucune n'est fournie
		this.images = options.images || [
			"https://picsum.photos/id/10/800/450",
			"https://picsum.photos/id/11/800/450",
			"https://picsum.photos/id/12/800/450",
			"https://picsum.photos/id/13/800/450",
		];

		// État et éléments du slider
		this.index = 0;
		this.btns = [];
		this.dots = [];
		this.items = [];
	}

	/**
	 * Initialise l'application Slider
	 */
	init() {
		// Création du slider
		const sliderElement = this.createSlider();
		this.container.appendChild(sliderElement);

		// Affichage de la première image et ajout des écouteurs d'événements
		this.showItems(0);
		this.addEventListeners();

		// Application du style par défaut
		this.injectCSS();
	}

	/**
	 * Crée les éléments du slider
	 * @returns {HTMLDivElement} div contenant le slider
	 */
	createSlider() {
		// Création du conteneur principal
		const container = document.createElement("div");
		container.classList.add("slider-container");

		// Création des éléments d'images
		this.images.forEach((img, i) => {
			const div = document.createElement("div");
			div.classList.add("items", "fade");

			const image = document.createElement("img");
			image.src = img;
			image.alt = `Image ${i + 1}`;

			div.appendChild(image);
			container.appendChild(div);

			this.items.push(div);
		});

		// Création des contrôles de navigation (points)
		const dots = document.createElement("div");
		dots.classList.add("dots");

		this.images.forEach((_, i) => {
			const dot = document.createElement("span");
			dot.classList.add("dot");
			dot.dataset.id = i;

			dots.appendChild(dot);
			this.dots.push(dot);
		});

		// Création des boutons précédent/suivant
		const next = document.createElement("a");
		next.classList.add("next");
		next.innerHTML = "&#10095;";

		const prev = document.createElement("a");
		prev.classList.add("prev");
		prev.innerHTML = "&#10094;";

		this.btns.push(next);
		this.btns.push(prev);

		// Ajout des éléments au conteneur
		container.appendChild(dots);
		container.appendChild(next);
		container.appendChild(prev);

		return container;
	}

	/**
	 * Ajoute les écouteurs d'événements sur les points et boutons
	 */
	addEventListeners() {
		this.dots.forEach((dot) => {
			dot.addEventListener("pointerdown", this.currentItem.bind(this));
		});

		this.btns.forEach((btn) => {
			btn.addEventListener("pointerdown", this.changeItem.bind(this));
		});
	}

	/**
	 * Affiche un élément du slider correspondant à l'index donné et cache les autres
	 * @param {number} n - Index de l'image à afficher
	 */
	showItems(n) {
		// Gestion des limites d'index (boucle)
		this.index =
			n > this.items.length - 1 ? 0 : n < 0 ? this.items.length - 1 : n;

		// Masquer toutes les images et réinitialiser les points
		this.items.forEach((item, i) => {
			item.style.display = "none";
			this.dots[i].classList.remove("active");
		});

		// Afficher l'image active et marquer le point correspondant
		this.items[this.index].style.display = "block";
		this.dots[this.index].classList.add("active");
	}

	/**
	 * Affiche l'image correspondant au point cliqué
	 * @param {MouseEvent} e - Événement de clic
	 */
	currentItem(e) {
		const n = parseInt(e.target.dataset.id);
		this.showItems(n);
	}

	/**
	 * Change l'image en fonction du bouton cliqué (précédent/suivant)
	 * @param {MouseEvent} e - Événement de clic
	 */
	changeItem(e) {
		if (e.target.classList.contains("next")) {
			this.showItems(++this.index);
		} else {
			this.showItems(--this.index);
		}
	}

	/**
	 * Injecte le CSS nécessaire pour le slider
	 */
	injectCSS() {
		// Vérifier si le style est déjà présent
		if (document.getElementById("slider-styles")) return;

		const style = document.createElement("style");
		style.id = "slider-styles";
		style.textContent = `
            .slider-container {
                width: 100%;
                height: 450px;
                position: relative;
                margin: auto;
                overflow: hidden;
            }
            
            .slider-container img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .slider-container .items {
                width: 100%;
                height: 100%;
                display: none;
            }
            
            /* Animation de fondu */
            .fade {
                animation-name: fade;
                animation-duration: 1.5s;
            }
            
            @keyframes fade {
                from {opacity: .4}
                to {opacity: 1}
            }
            
            /* Boutons précédent et suivant */
            .slider-container .prev,
            .slider-container .next {
                cursor: pointer;
                position: absolute;
                top: 50%;
                width: auto;
                margin-top: -22px;
                padding: 16px;
                color: white;
                font-weight: bold;
                font-size: 18px;
                transition: 0.6s ease;
                border-radius: 0 3px 3px 0;
                user-select: none;
                background-color: rgba(0, 0, 0, 0.3);
            }
            
            .slider-container .next {
                right: 0;
                border-radius: 3px 0 0 3px;
            }
            
            .slider-container .prev:hover,
            .slider-container .next:hover {
                background-color: rgba(0, 0, 0, 0.8);
            }
            
            /* Points de navigation */
            .slider-container .dots {
                width: 100%;
                position: absolute;
                bottom: 8px;
                text-align: center;
            }
            
            .slider-container .dot {
                cursor: pointer;
                height: 15px;
                width: 15px;
                margin: 0 2px;
                background-color: #bbb;
                border-radius: 50%;
                display: inline-block;
                transition: background-color 0.6s ease;
            }
            
            .slider-container .active,
            .slider-container .dot:hover {
                background-color: #717171;
            }
        `;

		document.head.appendChild(style);
	}

	/**
	 * Détruit l'application Slider et nettoie les ressources
	 */
	destroy() {
		// Supprimer les écouteurs d'événements
		this.dots.forEach((dot) => {
			dot.removeEventListener("pointerdown", this.currentItem.bind(this));
		});

		this.btns.forEach((btn) => {
			btn.removeEventListener("pointerdown", this.changeItem.bind(this));
		});

		// Vider le conteneur
		this.container.innerHTML = "";

		// Réinitialiser les tableaux
		this.btns = [];
		this.dots = [];
		this.items = [];
	}
}
