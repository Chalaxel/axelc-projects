import { useEffect, useState, useCallback, useRef } from 'react';
import { MondialRelayPoint } from '@monorepo/shared-types';
import styles from './DeliverySelector.module.css';

interface DeliverySelectorProps {
    onRelayPointSelected: (point: MondialRelayPoint) => void;
    selectedPoint: MondialRelayPoint | null;
}

declare global {
    interface Window {
        jQuery: any;
        $: any;
    }
    interface JQuery {
        MR_ParcelShopPicker: (options: any) => JQuery;
    }
}

export const DeliverySelector = ({
    onRelayPointSelected,
    selectedPoint,
}: DeliverySelectorProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const widgetRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);

    const loadScript = useCallback((src: string, id: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (document.getElementById(id)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.id = id;
            script.src = src;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }, []);

    const initializeWidget = useCallback(() => {
        if (!window.jQuery || !widgetRef.current || isInitialized.current) {
            return;
        }

        const brandCode = import.meta.env.VITE_MONDIAL_RELAY_BRAND || 'BDTEST13';

        try {
            window.jQuery('#mr-widget-container').MR_ParcelShopPicker({
                Target: '#mr-selected-point',
                Brand: brandCode,
                Country: 'FR',
                EnableGeolocalisatedSearch: true,
                ShowResultsOnMap: true,
                NbResults: 10,
                OnParcelShopSelected: (data: any) => {
                    const point: MondialRelayPoint = {
                        id: data.ID,
                        name: data.Nom,
                        address: `${data.Adresse1}${data.Adresse2 ? ' ' + data.Adresse2 : ''}`,
                        city: data.Ville,
                        postalCode: data.CP,
                        country: data.Pays,
                        latitude: data.Latitude,
                        longitude: data.Longitude,
                    };
                    onRelayPointSelected(point);
                },
            });
            isInitialized.current = true;
            setIsLoading(false);
        } catch (err) {
            console.error('Erreur initialisation widget Mondial Relay:', err);
            setError('Impossible de charger le sélecteur de point relais');
            setIsLoading(false);
        }
    }, [onRelayPointSelected]);

    useEffect(() => {
        const loadWidgetScripts = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Load jQuery first
                await loadScript(
                    'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',
                    'jquery-script',
                );

                // Load Google Maps API
                await loadScript(
                    'https://maps.googleapis.com/maps/api/js?key=&libraries=places',
                    'google-maps-script',
                );

                // Load Mondial Relay widget
                await loadScript(
                    'https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js',
                    'mondial-relay-widget-script',
                );

                // Small delay to ensure scripts are fully initialized
                setTimeout(initializeWidget, 100);
            } catch (err) {
                console.error('Erreur chargement scripts:', err);
                setError(
                    'Impossible de charger le widget Mondial Relay. Veuillez rafraîchir la page.',
                );
                setIsLoading(false);
            }
        };

        loadWidgetScripts();

        return () => {
            isInitialized.current = false;
        };
    }, [loadScript, initializeWidget]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Choisissez votre point relais</h2>
            <p className={styles.subtitle}>
                Entrez votre code postal ou ville pour trouver les points relais à proximité
            </p>

            {error && <div className={styles.error}>{error}</div>}

            {isLoading && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Chargement du sélecteur de point relais...</p>
                </div>
            )}

            <div
                id='mr-widget-container'
                ref={widgetRef}
                className={styles.widgetContainer}
                style={{ display: isLoading ? 'none' : 'block' }}
            ></div>

            {/* Hidden input to receive selected point ID */}
            <input type='hidden' id='mr-selected-point' />

            {selectedPoint && (
                <div className={styles.selectedPoint}>
                    <h3 className={styles.selectedTitle}>Point relais sélectionné</h3>
                    <div className={styles.pointDetails}>
                        <p className={styles.pointName}>{selectedPoint.name}</p>
                        <p className={styles.pointAddress}>{selectedPoint.address}</p>
                        <p className={styles.pointCity}>
                            {selectedPoint.postalCode} {selectedPoint.city}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
