/**
 * Types partagés entre le frontend et le backend
 * Ce fichier centralise les définitions de types pour éviter la duplication
 */

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoCreationAttributes {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface TodoUpdateAttributes {
  title?: string;
  description?: string;
  completed?: boolean;
}
