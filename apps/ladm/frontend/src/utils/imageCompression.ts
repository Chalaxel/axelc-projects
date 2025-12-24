/* eslint-disable no-undef */
// Les types File, FileReader, Image sont des types DOM standards et sont bien définis

/**
 * Compresse une image en la redimensionnant et en réduisant sa qualité
 * @param file - Le fichier image à compresser
 * @param maxWidth - Largeur maximale en pixels (par défaut 800)
 * @param maxHeight - Hauteur maximale en pixels (par défaut 800)
 * @param quality - Qualité de compression (0-1, par défaut 0.7)
 * @returns Promise avec l'image compressée en base64
 */
export const compressImage = async (
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 800,
    quality: number = 0.7,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = e => {
            const img = new Image();

            img.onload = () => {
                // Calculer les nouvelles dimensions en gardant le ratio
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                // Créer un canvas pour redimensionner l'image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Impossible de créer le contexte canvas'));
                    return;
                }

                // Dessiner l'image redimensionnée
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir en base64 avec compression
                try {
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => {
                reject(new Error("Erreur lors du chargement de l'image"));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Erreur lors de la lecture du fichier'));
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Obtient la taille d'une image en base64 en Ko
 * @param base64String - L'image en base64
 * @returns Taille en Ko
 */
export const getBase64Size = (base64String: string): number => {
    const base64Length = base64String.length - (base64String.indexOf(',') + 1);
    const padding = base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0;
    return ((base64Length * 3) / 4 - padding) / 1024;
};

/**
 * Formate la taille en une chaîne lisible
 * @param sizeInKb - Taille en Ko
 * @returns Chaîne formatée (ex: "1.5 Mo")
 */
export const formatSize = (sizeInKb: number): string => {
    if (sizeInKb < 1024) {
        return `${sizeInKb.toFixed(2)} Ko`;
    }
    return `${(sizeInKb / 1024).toFixed(2)} Mo`;
};
