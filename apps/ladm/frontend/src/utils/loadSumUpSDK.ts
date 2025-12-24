/**
 * Charge dynamiquement le SDK SumUp Payment Widget
 * @returns Promise qui se résout quand le SDK est chargé et prêt
 */
export const loadSumUpSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Vérifier si le SDK est déjà chargé
        if (window.SumUpCard) {
            resolve();
            return;
        }

        // Vérifier si le script est déjà en cours de chargement
        const existingScript = document.querySelector(
            'script[src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js"]',
        );

        if (existingScript) {
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', () =>
                reject(new Error('Erreur lors du chargement du SDK SumUp')),
            );
            return;
        }

        // Créer et charger le script
        const script = document.createElement('script');
        script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js';
        script.async = true;

        script.onload = () => {
            // Vérifier que le SDK est bien disponible
            if (window.SumUpCard) {
                resolve();
            } else {
                reject(new Error('SDK SumUp chargé mais non disponible'));
            }
        };

        script.onerror = () => {
            reject(new Error('Impossible de charger le SDK SumUp'));
        };

        document.head.appendChild(script);
    });
};
