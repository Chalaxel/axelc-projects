export const formStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1.5rem',
        padding: '1.5rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },
    section: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1rem',
    },
    label: {
        display: 'block' as const,
        marginBottom: '0.5rem',
        fontWeight: 'bold' as const,
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
    },
    textarea: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontFamily: 'inherit',
    },
    button: {
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer' as const,
        fontSize: '1rem',
    },
    buttonPrimary: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    buttonSecondary: {
        backgroundColor: '#6c757d',
        color: 'white',
    },
    buttonDanger: {
        backgroundColor: '#dc3545',
        color: 'white',
    },
    buttonSuccess: {
        backgroundColor: '#28a745',
        color: 'white',
    },
    buttonInfo: {
        backgroundColor: '#17a2b8',
        color: 'white',
    },
    badge: {
        padding: '0.25rem 0.75rem',
        color: 'white',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: 'bold' as const,
    },
    card: {
        marginBottom: '1rem',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white',
    },
    cardNested: {
        marginBottom: '1rem',
        padding: '1rem',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        backgroundColor: '#fafafa',
        marginLeft: '1rem',
    },
};
