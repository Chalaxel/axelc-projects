import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Article, ArticleCreationAttributes } from '@monorepo/shared-types';
import {
    articleService,
    textToHtml,
    htmlToText,
    generateSlug,
} from '../../../../services/articleService';
import { compressImage, getBase64Size, formatSize } from '../../../../utils/imageCompression';
import { ARTICLE_IMAGE_CONFIG } from '../../../../utils/imageConfig';
import styles from './ArticlesManagement.module.css';

const CATEGORIES = ['Événements', 'Nouveautés', 'Ateliers', 'Conseils'] as const;

interface ArticleFormData {
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    category: string;
    status: 'draft' | 'published';
    isFeatured: boolean;
}

const initialFormData: ArticleFormData = {
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    category: CATEGORIES[0],
    status: 'draft',
    isFeatured: false,
};

export const ArticlesManagement = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [formData, setFormData] = useState<ArticleFormData>(initialFormData);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionInfo, setCompressionInfo] = useState<{
        originalSize: string;
        compressedSize: string;
    } | null>(null);

    const queryClient = useQueryClient();

    const { data: articles = [], isLoading } = useQuery<Article[]>({
        queryKey: ['articles-admin'],
        queryFn: articleService.getAllArticlesAdmin,
    });

    const createMutation = useMutation({
        mutationFn: articleService.createArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles-admin'] });
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            resetForm();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ArticleCreationAttributes> }) =>
            articleService.updateArticle(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles-admin'] });
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            resetForm();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: articleService.deleteArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles-admin'] });
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
    });

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingArticle(null);
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

        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner un fichier image');
            return;
        }

        try {
            setIsCompressing(true);
            setCompressionInfo(null);

            const originalReader = new FileReader();
            const originalBase64 = await new Promise<string>((resolve, reject) => {
                originalReader.onload = e => resolve(e.target?.result as string);
                originalReader.onerror = reject;
                originalReader.readAsDataURL(file);
            });

            const originalSize = getBase64Size(originalBase64);

            const compressedBase64 = await compressImage(
                file,
                ARTICLE_IMAGE_CONFIG.maxWidth,
                ARTICLE_IMAGE_CONFIG.maxHeight,
                ARTICLE_IMAGE_CONFIG.quality,
            );
            const compressedSize = getBase64Size(compressedBase64);

            setFormData({ ...formData, imageUrl: compressedBase64 });
            setImagePreview(compressedBase64);

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

    const handleRemoveImage = () => {
        setFormData({ ...formData, imageUrl: '' });
        setImagePreview(null);
        setCompressionInfo(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const articleData: ArticleCreationAttributes = {
            title: formData.title,
            description: formData.description,
            content: textToHtml(formData.content),
            imageUrl: formData.imageUrl || null,
            category: formData.category,
            status: formData.status,
            isFeatured: formData.isFeatured,
            slug: editingArticle?.slug || generateSlug(formData.title),
        };

        if (editingArticle) {
            updateMutation.mutate({ id: editingArticle.id, data: articleData });
        } else {
            createMutation.mutate(articleData);
        }
    };

    const handleEdit = (article: Article) => {
        setEditingArticle(article);
        setFormData({
            title: article.title,
            description: article.description,
            content: htmlToText(article.content),
            imageUrl: article.imageUrl || '',
            category: article.category,
            status: article.status,
            isFeatured: article.isFeatured,
        });
        setImagePreview(article.imageUrl || null);
        setIsFormOpen(true);
    };

    const handleDelete = (articleId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            deleteMutation.mutate(articleId);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Gestion des articles</h2>
                <button
                    className={styles.addButton}
                    onClick={() => {
                        resetForm();
                        setIsFormOpen(true);
                    }}
                >
                    + Nouvel article
                </button>
            </div>

            {isFormOpen && (
                <div className={styles.formOverlay}>
                    <div className={styles.formContainer}>
                        <h3 className={styles.formTitle}>
                            {editingArticle ? "Modifier l'article" : 'Nouvel article'}
                        </h3>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor='title' className={styles.label}>
                                    Titre *
                                </label>
                                <input
                                    id='title'
                                    type='text'
                                    className={styles.input}
                                    value={formData.title}
                                    onChange={e =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='description' className={styles.label}>
                                    Description (résumé pour les cartes) *
                                </label>
                                <textarea
                                    id='description'
                                    className={styles.textarea}
                                    value={formData.description}
                                    onChange={e =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    required
                                    placeholder="Court résumé de l'article qui apparaîtra sur les cartes..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='content' className={styles.label}>
                                    Contenu de l'article *
                                </label>
                                <textarea
                                    id='content'
                                    className={`${styles.textarea} ${styles.textareaLarge}`}
                                    value={formData.content}
                                    onChange={e =>
                                        setFormData({ ...formData, content: e.target.value })
                                    }
                                    required
                                    placeholder="Contenu complet de l'article. Séparez les paragraphes par une ligne vide."
                                />
                                <small className={styles.hint}>
                                    Séparez les paragraphes par une ligne vide pour créer des
                                    sections distinctes.
                                </small>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='image' className={styles.label}>
                                    Image de l'article
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
                                    {ARTICLE_IMAGE_CONFIG.maxWidth}x{ARTICLE_IMAGE_CONFIG.maxHeight}
                                    px, qualité {ARTICLE_IMAGE_CONFIG.quality * 100}%)
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
                                    <div className={styles.imagePreviewContainer}>
                                        <img
                                            src={imagePreview}
                                            alt='Aperçu'
                                            className={styles.imagePreview}
                                        />
                                        <button
                                            type='button'
                                            className={styles.removeImageButton}
                                            onClick={handleRemoveImage}
                                        >
                                            Supprimer l'image
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor='category' className={styles.label}>
                                        Catégorie *
                                    </label>
                                    <select
                                        id='category'
                                        className={styles.select}
                                        value={formData.category}
                                        onChange={e =>
                                            setFormData({ ...formData, category: e.target.value })
                                        }
                                        required
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor='status' className={styles.label}>
                                        Statut *
                                    </label>
                                    <select
                                        id='status'
                                        className={styles.select}
                                        value={formData.status}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value as 'draft' | 'published',
                                            })
                                        }
                                        required
                                    >
                                        <option value='draft'>Brouillon</option>
                                        <option value='published'>Publié</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.checkbox}>
                                <input
                                    id='isFeatured'
                                    type='checkbox'
                                    checked={formData.isFeatured}
                                    onChange={e =>
                                        setFormData({ ...formData, isFeatured: e.target.checked })
                                    }
                                />
                                <label htmlFor='isFeatured'>Article mis en avant</label>
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
                                    disabled={
                                        createMutation.isPending ||
                                        updateMutation.isPending ||
                                        isCompressing
                                    }
                                >
                                    {createMutation.isPending || updateMutation.isPending
                                        ? 'Enregistrement...'
                                        : editingArticle
                                          ? 'Mettre à jour'
                                          : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles.articlesList}>
                {articles.length === 0 ? (
                    <div className={styles.empty}>
                        Aucun article disponible. Créez-en un pour commencer.
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Titre</th>
                                <th>Catégorie</th>
                                <th>Statut</th>
                                <th>Mis en avant</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map(article => (
                                <tr key={article.id}>
                                    <td>
                                        {article.imageUrl ? (
                                            <img
                                                src={article.imageUrl}
                                                alt={article.title}
                                                className={styles.thumbnail}
                                            />
                                        ) : (
                                            <div className={styles.noImage}>Pas d'image</div>
                                        )}
                                    </td>
                                    <td className={styles.articleTitle}>{article.title}</td>
                                    <td>
                                        <span className={styles.categoryBadge}>
                                            {article.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`${styles.statusBadge} ${
                                                article.status === 'published'
                                                    ? styles.statusPublished
                                                    : styles.statusDraft
                                            }`}
                                        >
                                            {article.status === 'published'
                                                ? 'Publié'
                                                : 'Brouillon'}
                                        </span>
                                    </td>
                                    <td>
                                        {article.isFeatured && (
                                            <span className={styles.featuredBadge}>Featured</span>
                                        )}
                                    </td>
                                    <td>
                                        {article.publishedAt
                                            ? new Date(article.publishedAt).toLocaleDateString(
                                                  'fr-FR',
                                              )
                                            : new Date(article.createdAt).toLocaleDateString(
                                                  'fr-FR',
                                              )}
                                    </td>
                                    <td className={styles.actions}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => handleEdit(article)}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDelete(article.id)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
