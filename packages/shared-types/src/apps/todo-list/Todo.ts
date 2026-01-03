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
