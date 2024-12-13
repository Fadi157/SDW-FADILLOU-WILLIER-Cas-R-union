export class Map {
    constructor() {
        if (typeof L === 'undefined') {
            throw new Error('Leaflet doit être chargé avant Map');
        }
        this.carte = null;
        this.groupesMarqueurs = {
            musee: L.layerGroup(),
            circuit: L.layerGroup(),
            lieu: L.layerGroup()
        };
        this.couleursMarqueurs = {
            musee: '#4CAF50',
            circuit: '#FF5722',
            lieu: '#2196F3'
        };
    }

    initialiserCarte() {
        this.carte = L.map('carte').setView([-21.115141, 55.536384], 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.carte);

        Object.values(this.groupesMarqueurs).forEach(groupe => groupe.addTo(this.carte));
    }

    creerMarqueur(lieu) {
        const marqueur = L.circleMarker(lieu.coordonnees, {
            radius: 8,
            fillColor: this.couleursMarqueurs[lieu.type],
            color: '#fff',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });

        marqueur.bindPopup(this.creerContenuPopup(lieu));
        this.groupesMarqueurs[lieu.type].addLayer(marqueur);
        
        return marqueur;
    }

    creerContenuPopup(lieu) {
        return `
            <div class="popup-contenu">
                <h3 class="popup-titre">${lieu.nom}</h3>
                <div class="popup-info">
                    <p>${lieu.description}</p>
                    ${lieu.telephone ? `<p>Tél: ${lieu.telephone}</p>` : ''}
                </div>
            </div>`;
    }

    mettreAJourMarqueurs(lieux) {
        Object.values(this.groupesMarqueurs).forEach(groupe => groupe.clearLayers());
        lieux.forEach(lieu => this.creerMarqueur(lieu));
    }

    basculerGroupeMarqueurs(type, visible) {
        if (visible) {
            this.groupesMarqueurs[type].addTo(this.carte);
        } else {
            this.carte.removeLayer(this.groupesMarqueurs[type]);
        }
    }

    centrerSurLieu(lieu) {
        this.carte.setView(lieu.coordonnees, 14);
    }
}
