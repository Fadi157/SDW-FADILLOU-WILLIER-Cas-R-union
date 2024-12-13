export class Filtres {
    constructor(api, map) {
        this.api = api;
        this.map = map;
        this.filtres = {
            musees: true,
            circuits: true,
            lieux: true
        };
        this.texteRecherche = '';
    }

    initialiserFiltres() {
        ['musees', 'circuits', 'lieux'].forEach(type => {
            const element = document.getElementById(type);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.filtres[type] = e.target.checked;
                    this.mettreAJourAffichage();
                });
            }
        });

        const barreRecherche = document.getElementById('barreRecherche');
        if (barreRecherche) {
            barreRecherche.addEventListener('input', (e) => {
                this.texteRecherche = e.target.value.toLowerCase();
                this.mettreAJourAffichage();
            });
        }
    }

    mettreAJourAffichage() {
        const lieuxFiltres = this.api.filtrerLieux(this.filtres, this.texteRecherche);
        this.mettreAJourListe(lieuxFiltres);
        this.map.mettreAJourMarqueurs(lieuxFiltres);
    }

    mettreAJourListe(lieux) {
        const listeLieux = document.getElementById('listeLieux');
        if (!listeLieux) return;

        listeLieux.innerHTML = '';
        lieux.forEach(lieu => {
            const element = document.createElement('div');
            element.className = `lieu-item ${lieu.type}`;
            
            element.innerHTML = `
                <div class="lieu-nom">${lieu.nom}</div>
                <div class="lieu-info">${this.getDescription(lieu)}</div>
            `;
            
            element.addEventListener('click', () => {
                this.map.centrerSurLieu(lieu);
            });

            listeLieux.appendChild(element);
        });
    }

    getDescription(lieu) {
        switch(lieu.type) {
            case 'musee':
                return `${lieu.adresse}, ${lieu.commune}`;
            case 'circuit':
                return `Difficulté: ${lieu.difficulte}/5 - Durée: ${Math.floor(lieu.duree_minutes_total/60)}h${lieu.duree_minutes_total%60}`;
            default:
                return lieu.description || '';
        }
    }
}