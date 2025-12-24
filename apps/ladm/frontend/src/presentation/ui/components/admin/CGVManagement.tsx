import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Page } from '@monorepo/shared-types';
import { pageService } from '../../../../services/pageService';
import styles from './CGVManagement.module.css';

export const CGVManagement = () => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    const queryClient = useQueryClient();

    const { data: page, isLoading } = useQuery<Page>({
        queryKey: ['page', 'cgv'],
        queryFn: () => pageService.getPageBySlug('cgv'),
    });

    useEffect(() => {
        if (page) {
            setContent(page.content);
            setTitle(page.title);
        }
    }, [page]);

    const updateMutation = useMutation({
        mutationFn: (data: { title: string; content: string }) =>
            pageService.updatePage('cgv', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['page', 'cgv'] });
            setHasChanges(false);
        },
    });

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        setHasChanges(true);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        setHasChanges(true);
    };

    const handleSave = () => {
        updateMutation.mutate({ title, content });
    };

    const handleReset = () => {
        if (page) {
            setContent(page.content);
            setTitle(page.title);
            setHasChanges(false);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>Édition des CGV</h2>
                <p className={styles.headerSubtitle}>
                    Modifiez le contenu des Conditions Générales de Vente. Le contenu est en HTML.
                </p>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor='title' className={styles.label}>
                    Titre de la page
                </label>
                <input
                    id='title'
                    type='text'
                    className={styles.input}
                    value={title}
                    onChange={handleTitleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor='content' className={styles.label}>
                    Contenu HTML
                </label>
                <textarea
                    id='content'
                    className={styles.textarea}
                    value={content}
                    onChange={handleContentChange}
                    rows={25}
                />
                <small className={styles.hint}>
                    Utilisez les balises HTML : &lt;section&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;,
                    &lt;li&gt;, &lt;strong&gt;, &lt;a href="..."&gt;
                </small>
            </div>

            <div className={styles.preview}>
                <h3 className={styles.previewTitle}>Aperçu</h3>
                <div
                    className={styles.previewContent}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>

            <div className={styles.actions}>
                <button
                    type='button'
                    className={styles.resetButton}
                    onClick={handleReset}
                    disabled={!hasChanges}
                >
                    Annuler les modifications
                </button>
                <button
                    type='button'
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={!hasChanges || updateMutation.isPending}
                >
                    {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>

            {updateMutation.isSuccess && (
                <div className={styles.successMessage}>✓ Modifications enregistrées avec succès</div>
            )}

            {updateMutation.isError && (
                <div className={styles.errorMessage}>
                    Erreur lors de l'enregistrement. Veuillez réessayer.
                </div>
            )}
        </div>
    );
};
