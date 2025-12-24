import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category, CategoryCreationAttributes } from '@monorepo/shared-types';
import { categoryService } from '../../../../services/categoryService';
import styles from './CategoriesManagement.module.css';

export const CategoriesManagement = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<CategoryCreationAttributes>({
        name: '',
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const { data: categories = [], isLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: categoryService.getAllCategories,
    });

    const createMutation = useMutation({
        mutationFn: categoryService.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            resetForm();
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || 'Erreur lors de la création');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CategoryCreationAttributes> }) =>
            categoryService.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            resetForm();
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || 'Erreur lors de la modification');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: categoryService.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            alert(
                error.response?.data?.message ||
                    'Erreur lors de la suppression. Vérifiez qu\'aucun produit n\'utilise cette catégorie.',
            );
        },
    });

    const resetForm = () => {
        setFormData({
            name: '',
        });
        setEditingCategory(null);
        setIsFormOpen(false);
        setErrorMessage(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
        });
        setIsFormOpen(true);
        setErrorMessage(null);
    };

    const handleDelete = (categoryId: string, categoryName: string) => {
        if (
            window.confirm(
                `Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ?\n\nNote: Vous ne pouvez pas supprimer une catégorie qui contient des produits.`,
            )
        ) {
            deleteMutation.mutate(categoryId);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Gestion des catégories</h2>
                <button
                    className={styles.addButton}
                    onClick={() => {
                        resetForm();
                        setIsFormOpen(true);
                    }}
                >
                    + Nouvelle catégorie
                </button>
            </div>

            {isFormOpen && (
                <div className={styles.formOverlay}>
                    <div className={styles.formContainer}>
                        <h3 className={styles.formTitle}>
                            {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                        </h3>

                        {errorMessage && (
                            <div className={styles.errorMessage}>{errorMessage}</div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>
                                    Nom de la catégorie *
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
                                    placeholder="Ex: Vêtements, Accessoires..."
                                    autoFocus
                                />
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
                                        : editingCategory
                                          ? 'Mettre à jour'
                                          : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles.categoriesList}>
                {categories.length === 0 ? (
                    <div className={styles.empty}>
                        Aucune catégorie disponible. Créez-en une pour commencer.
                    </div>
                ) : (
                    <div className={styles.cardsGrid}>
                        {categories.map((category) => (
                            <div key={category.id} className={styles.categoryCard}>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.categoryName}>{category.name}</h3>
                                    <div className={styles.categoryInfo}>
                                        <span className={styles.infoLabel}>Créée le:</span>
                                        <span className={styles.infoValue}>
                                            {new Date(category.createdAt).toLocaleDateString(
                                                'fr-FR',
                                            )}
                                        </span>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => handleEdit(category)}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDelete(category.id, category.name)}
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
        </div>
    );
};

