import { Actualite } from '@monorepo/shared-types';

export class ActualiteRepository {
    private mockData: Actualite[] = [
        {
            id: '1',
            title: 'Nouvelle Collection Printemps',
            description: 'Découvrez notre nouvelle collection inspirée des couleurs du printemps.',
            imageUrl: '/assets/images/actualites/printemps.jpg',
            date: new Date('2024-03-15'),
            content: "Contenu détaillé de l'actualité...",
            slug: 'nouvelle-collection-printemps',
        },
        // Add more mock data
    ];

    async getAllActualites(): Promise<Actualite[]> {
        // TODO: Replace with actual API call
        return this.mockData;
    }

    async getActualiteBySlug(slug: string): Promise<Actualite> {
        const actualite = this.mockData.find(a => a.slug === slug);
        if (!actualite) {
            throw new Error('Actualité non trouvée');
        }
        return actualite;
    }
}
