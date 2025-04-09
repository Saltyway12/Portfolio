"use strict";
export class JustePrix {
	constructor(options = {}) {
		// Options configurables
		this.container = options.container || document.body;
		this.maxNumber = options.maxNumber || 100;
		this.maxTrials = 7; // 0 = illimité

		// État interne
		this.randomNumber = null;
		this.trials = 0;
		this.gameOver = false;
		this.initialized = false;

		// Éléments DOM (seront créés lors de l'initialisation)
		this.form = null;
		this.input = null;
		this.error = null;
		this.instructions = null;
	}

	// Génère le HTML du jeu
	generateHTML() {
		// Création du jeu dans le conteneur
		this.container.innerHTML = `
        <div class="container">
          <div class="row justify-content-center mt-5">
            <header>Le Juste Prix</header>
          </div>
  
          <!-- Formulaire -->
          <div class="row justify-content-center mt-5 mb-4">
            <div class="col-lg-8">
              <div class="bg-light p-5 shadow">
                <form id="formulaire-juste-prix">
                  <div class="row">
                    <div class="col">
                      <input
                        id="prix-juste-prix"
                        class="form-control"
                        placeholder="Devinez le prix ! (entre 0 et ${this.maxNumber})" />
                    </div>
                    <button type="submit" class="btn btn-primary" id="button-deviner">
                      Deviner
                    </button>
                  </div>
                  <small class="text-danger error-juste-prix">Vous devez rentrer un nombre.</small>
                  <p></p>
                  <div class="row">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      id="button-reset">
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
  
          <!-- Instructions -->
          <div class="row justify-content-center">
            <div id="instructions-juste-prix" class="col-lg-8"></div>
          </div>
        </div>
      `;

		// Stocker les références aux éléments DOM (avec des IDs uniques pour éviter les conflits)
		this.form = document.getElementById("formulaire-juste-prix");
		this.input = document.getElementById("prix-juste-prix");
		this.error = document.querySelector(".error-juste-prix");
		this.instructions = document.getElementById("instructions-juste-prix");
		this.resetButton = document.getElementById("button-reset");

		return true;
	}

	// Injecte le CSS nécessaire
	injectCSS() {
		if (document.getElementById("juste-prix-styles")) return;

		const styleElement = document.createElement("style");
		styleElement.id = "juste-prix-styles";

		styleElement.textContent = `
        header {
          color: #ff7315;
          text-align: center;
          font-size: 3em;
        }
  
        #instructions-juste-prix {
          color: white;
        }
  
        .instruction {
          padding: 15px;
          margin: 10px 0;
        }
  
        .plus {
          background-color: #f67280;
        }
  
        .moins {
          background-color: #ffa372;
        }
  
        .fini {
          background-color: #0c9463;
        }
        
        .perdu {
          background-color: #f67280;
        }
      `;

		document.head.appendChild(styleElement);
	}

	// Génère un nombre aléatoire entre 0 et max
	getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

	// Vérification de la proposition
	check(number) {
		if (this.gameOver) return;

		let instruction = document.createElement("div");
		instruction.className = "instruction";

		if (number < this.randomNumber) {
			instruction.classList.add("plus");
			instruction.innerHTML = `#${this.trials} (${number}) c'est plus`;
		} else if (number > this.randomNumber) {
			instruction.classList.add("moins");
			instruction.innerHTML = `#${this.trials} (${number}) c'est moins`;
		} else {
			instruction.classList.add("fini");
			instruction.innerHTML = `#${this.trials} (${number}) c'est fini, vous avez gagné en ${this.trials} coups`;
			this.gameOver = true;
			this.input.disabled = true;
		}

		this.instructions.prepend(instruction);

		// Vérification du nombre maximum d'essais
		if (this.maxTrials > 0 && this.trials >= this.maxTrials && !this.gameOver) {
			this.gameOver = true;
			let gameOverInstruction = document.createElement("div");
			gameOverInstruction.className = "instruction perdu";
			gameOverInstruction.innerHTML = `Vous avez perdu ! Le nombre était ${this.randomNumber}`;
			this.instructions.prepend(gameOverInstruction);
			this.input.disabled = true;
		}
	}

	// Réinitialiser le jeu
	resetGame() {
		// Réinitialiser les variables
		this.trials = 0;
		this.gameOver = false;
		this.randomNumber = this.getRandomInt(this.maxNumber);

		// Réinitialiser l'interface
		this.input.value = "";
		this.input.disabled = false;
		this.instructions.innerHTML = "";
		this.error.style.display = "none";

		console.log("Nouveau nombre à deviner:", this.randomNumber);
	}

	// Initialise les comportements JavaScript
	initializeScripts() {
		// Cacher l'erreur au départ
		this.error.style.display = "none";

		// Générer le nombre aléatoire initial
		this.randomNumber = this.getRandomInt(this.maxNumber);
		console.log("Nombre à deviner:", this.randomNumber);

		// Gestionnaire d'événement pour le formulaire
		this.form.addEventListener("submit", (e) => {
			e.preventDefault();

			if (this.gameOver) return;

			let choosedNumber = parseInt(this.input.value);

			if (
				isNaN(choosedNumber) ||
				choosedNumber < 0 ||
				choosedNumber > this.maxNumber
			) {
				this.error.style.display = "inline";
				return;
			}

			this.error.style.display = "none";
			this.input.value = "";
			this.trials++;
			this.check(choosedNumber);
		});

		// Gestionnaire d'événement pour le bouton reset
		this.resetButton.addEventListener("click", () => {
			this.resetGame();
		});
	}

	// Méthode pour nettoyer les ressources (appelée quand on change d'application)
	destroy() {
		// Supprimer les écouteurs d'événements si nécessaire
		if (this.form) {
			// Suppression explicite des écouteurs d'événements (pour prévenir les fuites mémoire)
			this.form.onsubmit = null;
			this.resetButton.onclick = null;
		}

		// On pourrait aussi supprimer le CSS si plus aucune instance de JustePrix n'existe
		// (mais cela nécessiterait un compteur global d'instances)
	}

	// Méthode publique pour initialiser tout le jeu
	init() {
		if (this.initialized) return;

		// Étape 1: Injecter le CSS
		this.injectCSS();

		// Étape 2: Générer le HTML
		this.generateHTML();

		// Étape 3: Initialiser les scripts JS
		this.initializeScripts();

		this.initialized = true;
		console.log("Jeu du Juste Prix initialisé avec succès");
	}
}
