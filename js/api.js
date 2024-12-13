export class Api {
    constructor() {
        this.musees = [];
        this.circuits = [];
        this.lieuxRemarquables = [];
        this.tousLesLieux = [];
    }

    async chargerDonnees() {
        try {
            const [donneesMusees, donneesCircuits, donneesLieux] = await Promise.all([
                fetch('data/musees.json').then(res => res.json()),
                fetch('data/circuits.json').then(res => res.json()),
                fetch('data/lieux.json').then(res => res.json())
            ]);

            this.musees = donneesMusees.map(musee => ({
                ...musee,
                type: 'musee',
                nom: musee.nom_officiel_du_musee,
                coordonnees: [musee.latitude, musee.longitude],
                description: `${musee.adresse}, ${musee.commune}`
            }));

            this.circuits = donneesCircuits.map(circuit => ({
                ...circuit,
                type: 'circuit',
                nom: circuit.nom,
                coordonnees: circuit.location ? [circuit.location.lat, circuit.location.lon] : null,
                description: `Difficulté: ${circuit.difficulte}/5 - Durée: ${Math.floor(circuit.duree_minutes_total/60)}h${circuit.duree_minutes_total%60}`
            }));

            this.lieuxRemarquables = donneesLieux.map(lieu => ({
                ...lieu,
                type: 'lieu',
                nom: lieu.nom_du_lieu_remarquable,
                coordonnees: [lieu.coordonnees_geographiques.lat, lieu.coordonnees_geographiques.lon],
                description: lieu.accroche || lieu.description
            }));

            this.tousLesLieux = [...this.musees, ...this.circuits, ...this.lieuxRemarquables]
                .filter(lieu => lieu.coordonnees)
                .sort((a, b) => a.nom.localeCompare(b.nom));

            return this.tousLesLieux;
        } catch (erreur) {
            console.error('Erreur lors du chargement des données:', erreur);
            throw erreur;
        }
    }

    filtrerLieux(filtres, texteRecherche) {
        return this.tousLesLieux.filter(lieu => {
            const correspondType = (
                (filtres.musees && lieu.type === 'musee') ||
                (filtres.circuits && lieu.type === 'circuit') ||
                (filtres.lieux && lieu.type === 'lieu')
            );
            
            const correspondRecherche = texteRecherche === '' || 
                lieu.nom.toLowerCase().includes(texteRecherche.toLowerCase());

            return correspondType && correspondRecherche;
        });
    }
}
