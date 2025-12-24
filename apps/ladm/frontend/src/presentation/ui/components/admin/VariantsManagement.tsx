import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, ProductVariant, ProductVariantStatus } from '@monorepo/shared-types';
import { productService } from '../../../../services/productService';
import { compressImage, getBase64Size, formatSize } from '../../../../utils/imageCompression';
import { IMAGE_COMPRESSION_CONFIG } from '../../../../utils/imageConfig';
import styles from './VariantsManagement.module.css';

interface VariantFormData {
    name: string;
    stock: number;
    imageBase64?: string;
}

export const VariantsManagement = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionInfo, setCompressionInfo] = useState<{
        originalSize: string;
        compressedSize: string;
    } | null>(null);
    const [formData, setFormData] = useState<VariantFormData>({
        name: '',
        stock: 1,
    });

    const queryClient = useQueryClient();

    const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: productService.getAllProductsAdmin,
    });

    const { data: variants = [], isLoading: isLoadingVariants } = useQuery<ProductVariant[]>({
        queryKey: ['variants', selectedProductId],
        queryFn: () => productService.getProductVariants(selectedProductId),
        enabled: !!selectedProductId,
    });

    const createMutation = useMutation({
        mutationFn: ({ productId, data }: { productId: string; data: VariantFormData }) => {
            // Calculer le status automatiquement en fonction du stock
            const status: ProductVariantStatus = data.stock > 0 ? 'available' : 'sold';
            const variantData = {
                ...data,
                status,
            };
            return productService.createVariant(productId, variantData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variants', selectedProductId] });
            resetForm();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            variantId,
            data,
        }: {
            variantId: string;
            data: Partial<VariantFormData>;
        }) => {
            // Calculer le status automatiquement en fonction du stock si le stock est défini
            const status: ProductVariantStatus | undefined =
                data.stock !== undefined ? (data.stock > 0 ? 'available' : 'sold') : undefined;
            const variantData: Partial<
                Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt'>
            > = {
                ...data,
            };
            if (status !== undefined) {
                variantData.status = status;
            }
            return productService.updateVariant(variantId, variantData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variants', selectedProductId] });
            resetForm();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: productService.deleteVariant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variants', selectedProductId] });
        },
    });

    const resetForm = () => {
        setFormData({
            name: '',
            stock: 1,
        });
        setEditingVariant(null);
        setIsFormOpen(false);
        setImagePreview(null);
        setCompressionInfo(null);
        setIsCompressing(false);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        // Vérifier que c'est bien une image
        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner un fichier image');
            return;
        }

        try {
            setIsCompressing(true);
            setCompressionInfo(null);

            // Lire l'image originale pour obtenir sa taille
            const originalReader = new FileReader();
            const originalBase64 = await new Promise<string>((resolve, reject) => {
                originalReader.onload = e => resolve(e.target?.result as string);
                originalReader.onerror = reject;
                originalReader.readAsDataURL(file);
            });

            const originalSize = getBase64Size(originalBase64);

            // Compresser l'image avec la configuration définie
            const compressedBase64 = await compressImage(
                file,
                IMAGE_COMPRESSION_CONFIG.maxWidth,
                IMAGE_COMPRESSION_CONFIG.maxHeight,
                IMAGE_COMPRESSION_CONFIG.quality,
            );
            const compressedSize = getBase64Size(compressedBase64);

            // Mettre à jour le formulaire avec l'image compressée
            setFormData({ ...formData, imageBase64: compressedBase64 });
            setImagePreview(compressedBase64);

            // Afficher les informations de compression
            setCompressionInfo({
                originalSize: formatSize(originalSize),
                compressedSize: formatSize(compressedSize),
            });
        } catch (error) {
            console.error('Erreur lors de la compression:', error);
            alert("Erreur lors de la compression de l'image. Veuillez réessayer.");
        } finally {
            setIsCompressing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProductId && !editingVariant) {
            alert('Veuillez sélectionner un produit');
            return;
        }

        if (editingVariant) {
            updateMutation.mutate({ variantId: editingVariant.id, data: formData });
        } else {
            createMutation.mutate({ productId: selectedProductId, data: formData });
        }
    };

    const handleEdit = (variant: ProductVariant) => {
        setEditingVariant(variant);
        const formDataToSet: VariantFormData = {
            name: variant.name,
            stock: variant.stock,
        };
        if (variant.imageBase64) {
            formDataToSet.imageBase64 = variant.imageBase64;
        }
        setFormData(formDataToSet);
        setImagePreview(variant.imageBase64 || null);
        setIsFormOpen(true);
    };

    const handleDelete = (variantId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette variante ?')) {
            deleteMutation.mutate(variantId);
        }
    };

    if (isLoadingProducts) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Gestion des variantes</h2>
                <button
                    className={styles.addButton}
                    onClick={() => {
                        if (!selectedProductId) {
                            alert('Veuillez sélectionner un produit');
                            return;
                        }
                        resetForm();
                        setIsFormOpen(true);
                    }}
                    disabled={!selectedProductId}
                >
                    + Nouvelle variante
                </button>
            </div>

            <div className={styles.productSelector}>
                <label htmlFor='product-select' className={styles.label}>
                    Sélectionner un produit :
                </label>
                <select
                    id='product-select'
                    className={styles.select}
                    value={selectedProductId}
                    onChange={e => setSelectedProductId(e.target.value)}
                >
                    <option value=''>-- Choisir un produit --</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>
                            {product.name} ({(product.price / 100).toFixed(2)} €)
                        </option>
                    ))}
                </select>
            </div>

            {isFormOpen && (
                <div className={styles.formOverlay}>
                    <div className={styles.formContainer}>
                        <h3 className={styles.formTitle}>
                            {editingVariant ? 'Modifier la variante' : 'Nouvelle variante'}
                        </h3>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor='name' className={styles.label}>
                                    Nom de la variante *
                                </label>
                                <input
                                    id='name'
                                    type='text'
                                    className={styles.input}
                                    value={formData.name}
                                    onChange={e =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                    placeholder='Ex: Rouge, Taille M, 500g...'
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='stock' className={styles.label}>
                                    Stock *
                                </label>
                                <input
                                    id='stock'
                                    type='number'
                                    min='0'
                                    className={styles.input}
                                    value={formData.stock}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            stock: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    required
                                />
                                <small className={styles.hint}>
                                    Nombre d'exemplaires disponibles pour cette variante. Le statut
                                    sera calculé automatiquement (disponible si stock &gt; 0).
                                </small>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='image' className={styles.label}>
                                    Image de la variante
                                </label>
                                <input
                                    id='image'
                                    type='file'
                                    accept='image/*'
                                    className={styles.fileInput}
                                    onChange={handleImageChange}
                                    disabled={isCompressing}
                                />
                                <small className={styles.hint}>
                                    L'image sera automatiquement compressée (max{' '}
                                    {IMAGE_COMPRESSION_CONFIG.maxWidth}x
                                    {IMAGE_COMPRESSION_CONFIG.maxHeight}px, qualité{' '}
                                    {IMAGE_COMPRESSION_CONFIG.quality * 100}%)
                                </small>

                                {isCompressing && (
                                    <div className={styles.compressingIndicator}>
                                        <span className={styles.spinner}></span>
                                        <span>Compression en cours...</span>
                                    </div>
                                )}

                                {compressionInfo && (
                                    <div className={styles.compressionInfo}>
                                        <span className={styles.compressionSuccess}>✓</span>
                                        <span>
                                            Compressée : {compressionInfo.originalSize} →{' '}
                                            {compressionInfo.compressedSize}
                                        </span>
                                    </div>
                                )}

                                {imagePreview && (
                                    <div className={styles.imagePreview}>
                                        <img src={imagePreview} alt='Aperçu' />
                                        <button
                                            type='button'
                                            className={styles.removeImageButton}
                                            onClick={() => {
                                                const { imageBase64, ...rest } = formData;
                                                setFormData(rest);
                                                setImagePreview(null);
                                                setCompressionInfo(null);
                                            }}
                                        >
                                            Supprimer l'image
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type='button'
                                    className={styles.cancelButton}
                                    onClick={resetForm}
                                >
                                    Annuler
                                </button>
                                <button
                                    type='submit'
                                    className={styles.submitButton}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {createMutation.isPending || updateMutation.isPending
                                        ? 'Enregistrement...'
                                        : editingVariant
                                          ? 'Mettre à jour'
                                          : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedProductId && (
                <div className={styles.variantsList}>
                    {isLoadingVariants ? (
                        <div className={styles.loading}>Chargement des variantes...</div>
                    ) : variants.length === 0 ? (
                        <div className={styles.empty}>
                            Aucune variante pour ce produit. Créez-en une pour commencer.
                        </div>
                    ) : (
                        <div className={styles.cardsGrid}>
                            {variants.map(variant => (
                                <div key={variant.id} className={styles.variantCard}>
                                    {variant.imageBase64 && (
                                        <div className={styles.cardImage}>
                                            <img src={variant.imageBase64} alt={variant.name} />
                                        </div>
                                    )}
                                    <div className={styles.cardContent}>
                                        <h4 className={styles.variantName}>{variant.name}</h4>
                                        <div className={styles.variantDetails}>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Stock:</span>
                                                <span
                                                    className={`${styles.badge} ${
                                                        variant.stock > 0
                                                            ? styles.badgeSuccess
                                                            : styles.badgeDanger
                                                    }`}
                                                >
                                                    {variant.stock} en stock
                                                </span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Statut:</span>
                                                <span
                                                    className={`${styles.badge} ${
                                                        variant.status === 'available'
                                                            ? styles.badgeSuccess
                                                            : variant.status === 'reserved'
                                                              ? styles.badgeWarning
                                                              : styles.badgeDanger
                                                    }`}
                                                >
                                                    {variant.status === 'available'
                                                        ? 'Disponible'
                                                        : variant.status === 'reserved'
                                                          ? 'Réservé'
                                                          : 'Épuisé'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.cardActions}>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => handleEdit(variant)}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(variant.id)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
