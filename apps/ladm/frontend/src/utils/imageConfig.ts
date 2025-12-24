/**
 * Configuration pour la compression des images
 *
 * COMMENT UTILISER :
 * - Modifiez les valeurs ci-dessous pour ajuster la compression
 * - maxWidth/maxHeight : dimensions maximales en pixels (l'image garde ses proportions)
 * - quality : qualité JPEG de 0 (faible) à 1 (maximale)
 *
 * EXEMPLES DE RÉSULTATS :
 * - Image 5 Mo (4000x3000px) → ~200-400 Ko (800x600px) avec quality 0.7
 * - Image 2 Mo (2000x2000px) → ~100-200 Ko (800x800px) avec quality 0.7
 *
 * RECOMMANDATIONS :
 * - Pour des photos de produits : 800x800px, quality 0.7 (config actuelle)
 * - Pour des images haute qualité : 1200x1200px, quality 0.85
 * - Pour des miniatures : 200x200px, quality 0.6
 */

export const IMAGE_COMPRESSION_CONFIG = {
    // Dimensions maximales de l'image (en pixels)
    // Plus petit = fichier plus léger, moins de détails
    maxWidth: 800,
    maxHeight: 800,

    // Qualité de compression JPEG (0-1)
    // 0.7 = Bon compromis entre qualité et taille (~70% de réduction)
    // 0.8 = Meilleure qualité (~50% de réduction)
    // 0.6 = Plus compressé (~80% de réduction)
    quality: 0.7,

    // Taille maximale acceptée en Mo (optionnel, pour afficher un avertissement)
    maxSizeMb: 10,
};

// Configuration spécifique pour les images d'articles (bannières plus grandes)
export const ARTICLE_IMAGE_CONFIG = {
    maxWidth: 1600,
    maxHeight: 900,
    quality: 0.85,
};

/**
 * Profils de compression prédéfinis
 */
export const COMPRESSION_PRESETS = {
    // Qualité maximale, moins de compression
    high: {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
    },

    // Équilibre entre qualité et taille (par défaut)
    medium: {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.7,
    },

    // Compression maximale, fichier léger
    low: {
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.6,
    },

    // Pour les miniatures
    thumbnail: {
        maxWidth: 200,
        maxHeight: 200,
        quality: 0.6,
    },
};
