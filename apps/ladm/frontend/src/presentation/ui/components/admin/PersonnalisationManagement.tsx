import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Page } from '@monorepo/shared-types';
import { pageService } from '../../../../services/pageService';
import styles from './PersonnalisationManagement.module.css';

export const PersonnalisationManagement = () => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [pdfBase64, setPdfBase64] = useState('');
    const [pdfName, setPdfName] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    const { data: page, isLoading } = useQuery<Page>({
        queryKey: ['page', 'personnalisation'],
        queryFn: () => pageService.getPageBySlug('personnalisation'),
    });

    useEffect(() => {
        if (page) {
            setContent(page.content);
            setTitle(page.title);
            setPdfBase64(page.metadata?.pdfBase64 || '');
            setPdfName(page.metadata?.pdfName || '');
        }
    }, [page]);

    const updateMutation = useMutation({
        mutationFn: (data: { title: string; content: string; metadata?: { pdfBase64?: string; pdfName?: string } }) =>
            pageService.updatePage('personnalisation', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['page', 'personnalisation'] });
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

    const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Veuillez sélectionner un fichier PDF');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            setPdfBase64(base64);
            setPdfName(file.name);
            setHasChanges(true);
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePdf = () => {
        setPdfBase64('');
        setPdfName('');
        setHasChanges(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = () => {
        updateMutation.mutate({
            title,
            content,
            metadata: { pdfBase64, pdfName },
        });
    };

    const handleReset = () => {
        if (page) {
            setContent(page.content);
            setTitle(page.title);
            setPdfBase64(page.metadata?.pdfBase64 || '');
            setPdfName(page.metadata?.pdfName || '');
            setHasChanges(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>Édition de la page Personnalisation</h2>
                <p className={styles.headerSubtitle}>
                    Modifiez le contenu de la page Personnalisation. Le contenu est en HTML.
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
                <label htmlFor='pdfFile' className={styles.label}>
                    Fichier PDF (catalogue des motifs)
                </label>
                {pdfBase64 ? (
                    <div className={styles.pdfPreview}>
                        <div className={styles.pdfInfo}>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                            >
                                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                                <polyline points='14 2 14 8 20 8' />
                                <line x1='16' y1='13' x2='8' y2='13' />
                                <line x1='16' y1='17' x2='8' y2='17' />
                                <polyline points='10 9 9 9 8 9' />
                            </svg>
                            <span>{pdfName || 'Fichier PDF'}</span>
                        </div>
                        <div className={styles.pdfActions}>
                            <a
                                href={pdfBase64}
                                download={pdfName || 'catalogue.pdf'}
                                className={styles.previewButton}
                            >
                                Télécharger
                            </a>
                            <button
                                type='button'
                                onClick={handleRemovePdf}
                                className={styles.removeButton}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.uploadZone}>
                        <input
                            ref={fileInputRef}
                            id='pdfFile'
                            type='file'
                            accept='application/pdf'
                            onChange={handlePdfUpload}
                            className={styles.fileInput}
                        />
                        <label htmlFor='pdfFile' className={styles.uploadLabel}>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='32'
                                height='32'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                            >
                                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                                <polyline points='17 8 12 3 7 8' />
                                <line x1='12' y1='3' x2='12' y2='15' />
                            </svg>
                            <span>Cliquez pour uploader un fichier PDF</span>
                        </label>
                    </div>
                )}
                <small className={styles.hint}>
                    Uploadez le catalogue des motifs au format PDF
                </small>
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
                    Utilisez les classes CSS : hero, infoCard, processSection, steps, step,
                    stepNumber, contactCard, contactButtons, contactButton
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
                <div className={styles.successMessage}>
                    Modifications enregistrées avec succès
                </div>
            )}

            {updateMutation.isError && (
                <div className={styles.errorMessage}>
                    Erreur lors de l'enregistrement. Veuillez réessayer.
                </div>
            )}
        </div>
    );
};
