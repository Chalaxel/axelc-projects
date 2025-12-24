export interface PageMetadata {
    pdfBase64?: string;
    pdfName?: string;
    [key: string]: string | undefined;
}

export interface Page {
    id: string;
    slug: string;
    title: string;
    content: string; // Contenu HTML
    metadata?: PageMetadata;
    createdAt: Date;
    updatedAt: Date;
}

export interface PageCreationAttributes {
    slug: string;
    title: string;
    content: string;
    metadata?: PageMetadata;
}

export interface PageUpdateAttributes {
    title?: string;
    content?: string;
    metadata?: PageMetadata;
}
