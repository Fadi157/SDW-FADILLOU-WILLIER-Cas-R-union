// Fadillou WILLIER

import { Api } from './api.js';
import { Map } from './map.js';
import { Filtres } from './filtres.js';

class Application {
    constructor() {
        this.api = new Api();
        this.map = new Map();
        this.filtres = null;
    }


    async initialiser() {
        try {
            this.map.initialiserCarte();
            await this.api.chargerDonnees();
            this.filtres = new Filtres(
                this.api,
                this.map
            );
            this.filtres.initialiserFiltres();
            this.filtres.mettreAJourAffichage();
        } catch (erreur) {
            console.error('Erreur lors de l\'initialisation:', erreur);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.initialiser();
});
