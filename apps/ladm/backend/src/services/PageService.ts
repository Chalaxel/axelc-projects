import { models } from '../models/models';
import { Page, PageUpdateAttributes, PageMetadata } from '@monorepo/shared-types';

const DEFAULT_CGV_CONTENT = `
<section>
    <h2>1. Présentation de la boutique en ligne</h2>
    <p>La boutique L'atelier de Mathilde est spécialisée dans la création et vente d'articles de couture fait mains.</p>
</section>

<section>
    <h2>2. Acceptation des Conditions Générales de Vente</h2>
    <p>En passant une commande sur le site, le client accepte sans réserve les présentes conditions générales de vente. Les CGV peuvent être modifiées à tout moment, les conditions applicables étant celles en vigueur au moment de la commande.</p>
</section>

<section>
    <h2>3. Produits et Disponibilité</h2>
    <p>Les produits sont présentés sur le site avec des descriptions détaillées et des photos. La disponibilité des produits est indiquée en temps réel, cependant, un produit peut être temporairement ou définitivement en rupture de stock.</p>
</section>

<section>
    <h2>4. Prix</h2>
    <p>Les prix des produits sont indiqués en euros (€) toutes taxes comprises (TTC), hors frais de livraison. Les frais de livraison sont calculés en fonction de l'adresse de livraison et seront précisés avant la validation finale de la commande. Suivant la période, des promotions sont applicables.</p>
</section>

<section>
    <h2>5. Commande</h2>
    <p>La commande se fait en plusieurs étapes :</p>
    <ul>
        <li>Sélection des produits</li>
        <li>Validation du panier</li>
        <li>Saisie des informations de livraison et de facturation</li>
        <li>Choix du mode de paiement : virement fortement recommandé</li>
        <li>Confirmation de la commande : la commande ne sera considérée comme ferme qu'après réception d'un email de confirmation et confirmation du paiement reçu.</li>
    </ul>
</section>

<section>
    <h2>6. Paiement</h2>
    <p>Les paiements peuvent être effectués par virement bancaire (un mail vous sera envoyé avec mes coordonnées), espèces ou chèque. En attendant le règlement, les articles vous seront mis de côté.</p>
    <p>La commande sera validée une fois le paiement reçu.</p>
</section>

<section>
    <h2>7. Livraison</h2>
    <p>La livraison des produits est effectuée via La Poste ou Mondial Relay (à l'adresse renseignée par le client lors de la commande ou en point relai), ou en mains propre (suivant le lieu de résidence…). Les délais de livraison sont estimés entre 2 et 8 jours ouvrés à partir de la réception de la commande. Des frais de livraison peuvent s'appliquer en fonction du poids ou de la destination.</p>
</section>

<section>
    <h2>8. Droit de Rétractation</h2>
    <p>Conformément à la législation, le client dispose d'un délai de 14 jours à compter de la réception des produits pour exercer son droit de rétractation. Les produits doivent être retournés dans leur état d'origine et dans leur emballage d'origine, à l'adresse suivante : <strong>L'atelier de Mathilde, 2 chemin des Croix 42560 GUMIERES</strong>. Les frais de retour sont à la charge du client.</p>
</section>

<section>
    <h2>9. Garantie et Retour des Produits</h2>
    <p>Les produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés, conformément aux dispositions du Code de la consommation. En cas de produit défectueux ou non conforme, le client peut demander un échange ou un remboursement. Les retours doivent être effectués dans un délai de 10 jours.</p>
</section>

<section>
    <h2>10. Responsabilité</h2>
    <p>Nous mettons tout en œuvre pour assurer l'exactitude des informations présentes sur notre site. Cependant, la responsabilité de L'atelier de Mathilde ne saurait être engagée en cas d'erreur typographique, d'indisponibilité temporaire d'un produit ou d'un incident lors de la livraison.</p>
</section>

<section>
    <h2>11. Propriété intellectuelle</h2>
    <p>Tous les contenus présents sur le site (textes, images, logos, etc.) sont la propriété exclusive de L'atelier de Mathilde et sont protégés par les droits d'auteur et la législation sur la propriété intellectuelle. Toute reproduction ou utilisation sans autorisation est interdite.</p>
</section>

<section>
    <h2>12. Données personnelles</h2>
    <p>Nous collectons vos informations personnelles uniquement dans le cadre de la gestion des commandes et de l'envoi de newsletters. Conformément à la loi informatique et libertés, vous pouvez accéder, rectifier ou supprimer vos données personnelles en nous contactant à l'adresse mail suivante: <a href="mailto:latelierdemathilde@yahoo.com">latelierdemathilde@yahoo.com</a>.</p>
</section>

<section>
    <h2>13. Litiges</h2>
    <p>Les présentes CGV sont soumises à la législation française. En cas de litige, le client peut recourir à une médiation ou saisir le tribunal compétent.</p>
</section>

<section>
    <h2>14. Contact</h2>
    <p>Pour toute question ou réclamation, vous pouvez nous contacter à l'adresse suivante :</p>
    <ul>
        <li><strong>Email :</strong> <a href="mailto:latelierdemathilde@yahoo.com">latelierdemathilde@yahoo.com</a></li>
        <li><strong>Adresse :</strong> L'atelier de Mathilde – 2 chemin des Croix – 42560 GUMIERES</li>
    </ul>
</section>
`;

const DEFAULT_PERSONNALISATION_CONTENT = `
<style>
.processTitle {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    text-align: center;
    color: #402E32;
}
.steps {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
}
.step {
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.stepNumber {
    width: 48px;
    height: 48px;
    background: #E0B894;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
}
.step h3 {
    font-size: 1.375rem;
    margin-bottom: 1rem;
    color: #402E32;
}
.step p {
    color: #666;
    font-size: 1rem;
    line-height: 1.7;
}
.step a {
    color: #E0B894;
    text-decoration: none;
    font-weight: 500;
}
@media (max-width: 968px) {
    .steps { grid-template-columns: 1fr; }
    .processTitle { font-size: 2rem; }
}
</style>

<h2 class="processTitle">Comment ça fonctionne ?</h2>
<div class="steps">
    <div class="step">
        <div class="stepNumber">1</div>
        <h3>Votre demande</h3>
        <p>Formulez votre demande de personnalisation via Messenger ou par email à <a href="mailto:latelierdemathilde@yahoo.com">latelierdemathilde@yahoo.com</a></p>
    </div>
    <div class="step">
        <div class="stepNumber">2</div>
        <h3>Devis personnalisé</h3>
        <p>Je réaliserai un devis détaillé comprenant l'article, le support (toile de point de croix), le type d'écriture et/ou le motif, ainsi que la ou les couleur(s) choisie(s).</p>
    </div>
    <div class="step">
        <div class="stepNumber">3</div>
        <h3>Conseils personnalisés</h3>
        <p>Je vous apporterai mes conseils en fonction de l'article à personnaliser pour garantir un résultat optimal.</p>
    </div>
    <div class="step">
        <div class="stepNumber">4</div>
        <h3>Fabrication</h3>
        <p>Un délai de fabrication est à prévoir. Anticipez donc vos demandes, notamment pour les occasions spéciales !</p>
    </div>
</div>
`;

const DEFAULT_PERSONNALISATION_METADATA: PageMetadata = {};

interface PageDefaults {
    title: string;
    content: string;
    metadata?: PageMetadata;
}

const PAGE_DEFAULTS: Record<string, PageDefaults> = {
    cgv: {
        title: 'Conditions Générales de Vente (CGV)',
        content: DEFAULT_CGV_CONTENT,
    },
    personnalisation: {
        title: 'Personnalisation des articles',
        content: DEFAULT_PERSONNALISATION_CONTENT,
        metadata: DEFAULT_PERSONNALISATION_METADATA,
    },
};

export class PageService {
    static async getPageBySlug(slug: string): Promise<Page | null> {
        const page = await models.page.findOne({
            where: { slug },
        });

        if (!page) {
            const defaults = PAGE_DEFAULTS[slug];
            if (defaults) {
                const newPage = await models.page.create({
                    slug,
                    title: defaults.title,
                    content: defaults.content,
                    metadata: defaults.metadata,
                });
                return newPage.toJSON();
            }
            return null;
        }

        return page.toJSON();
    }

    static async updatePage(slug: string, data: PageUpdateAttributes): Promise<Page | null> {
        const page = await models.page.findOne({
            where: { slug },
        });

        const defaults = PAGE_DEFAULTS[slug];
        if (!page) {
            const newPage = await models.page.create({
                slug,
                title: data.title || defaults?.title || slug.toUpperCase(),
                content: data.content || defaults?.content || '',
                metadata: data.metadata || defaults?.metadata,
            });
            return newPage.toJSON();
        }

        await page.update({ ...data, content: data.content || defaults?.content || '' });
        return page.toJSON();
    }

    static async getAllPages(): Promise<Page[]> {
        const pages = await models.page.findAll({
            order: [['slug', 'ASC']],
        });
        return pages.map((p) => p.toJSON());
    }
}
