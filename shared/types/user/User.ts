export interface User {
    id: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserCreationAttributes {
    email: string;
    password: string;
}

export interface UserPublic {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}
