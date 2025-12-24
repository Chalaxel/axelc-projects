import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, ProductCreationAttributes, Category } from '@monorepo/shared-types';
import { productService } from '../../../../services/productService';
import { categoryService } from '../../../../services/categoryService';
import styles from './ProductsManagement.module.css';

export const ProductsManagement = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<ProductCreationAttributes>({
        name: '',
        price: 0,
        categoryId: '',
    });

    const queryClient = useQueryClient();

    const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
        queryKey: ['products-admin'],
        queryFn: productService.getAllProductsAdmin,
    });

    const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: categoryService.getAllCategories,
    });

    const createMutation = useMutation({
        mutationFn: productService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            resetForm();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ProductCreationAttributes> }) =>
            productService.updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            resetForm();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const resetForm = () => {
        setFormData({
            name: '',
            price: 0,
            categoryId: '',
        });
        setEditingProduct(null);
        setIsFormOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            updateMutation.mutate({ id: editingProduct.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            categoryId: product.categoryId,
        });
        setIsFormOpen(true);
    };

    const handleDelete = (productId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit et toutes ses variantes ?')) {
            deleteMutation.mutate(productId);
        }
    };

    if (isLoadingProducts || isLoadingCategories) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Gestion des produits</h2>
                <button
                    className={styles.addButton}
                    onClick={() => {
                        resetForm();
                        setIsFormOpen(true);
                    }}
                >
                    + Nouveau produit
                </button>
            </div>

            {isFormOpen && (
                <div className={styles.formOverlay}>
                    <div className={styles.formContainer}>
                        <h3 className={styles.formTitle}>
                            {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                        </h3>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>
                                    Nom du produit *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className={styles.input}
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="price" className={styles.label}>
                                    Prix (en centimes) *
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    className={styles.input}
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: Number(e.target.value) })
                                    }
                                    required
                                    min="0"
                                />
                                <small className={styles.hint}>
                                    Prix en centimes (ex: 1000 = 10,00 €)
                                </small>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="categoryId" className={styles.label}>
                                    Catégorie *
                                </label>
                                <select
                                    id="categoryId"
                                    className={styles.select}
                                    value={formData.categoryId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, categoryId: e.target.value })
                                    }
                                    required
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={resetForm}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {createMutation.isPending || updateMutation.isPending
                                        ? 'Enregistrement...'
                                        : editingProduct
                                          ? 'Mettre à jour'
                                          : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles.productsList}>
                {products.length === 0 ? (
                    <div className={styles.empty}>
                        Aucun produit disponible. Créez-en un pour commencer.
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prix</th>
                                <th>Catégorie</th>
                                <th>Date de création</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => {
                                const category = categories.find(
                                    (cat) => cat.id === product.categoryId,
                                );
                                return (
                                    <tr key={product.id}>
                                        <td className={styles.productName}>{product.name}</td>
                                        <td>{(product.price / 100).toFixed(2)} €</td>
                                        <td>{category?.name || 'N/A'}</td>
                                        <td>
                                            {new Date(product.createdAt).toLocaleDateString(
                                                'fr-FR',
                                            )}
                                        </td>
                                        <td className={styles.actions}>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => handleEdit(product)}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

