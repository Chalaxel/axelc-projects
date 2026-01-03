import { getDatabase } from '../utils/dbSync';
import { initTodoModel, getTodoModel } from '../models/Todo';

// Initialize model
const db = getDatabase();
initTodoModel(db);
const TodoModel = getTodoModel();
import { Todo, TodoCreationAttributes, TodoUpdateAttributes } from '@monorepo/shared-types';
import { Op } from 'sequelize';

export class TodoService {
    async getAll(): Promise<Todo[]> {
        const todos = await TodoModel.findAll({
            order: [['createdAt', 'DESC']],
        });
        return todos.map(todo => todo.toJSON() as Todo);
    }

    async getById(id: string): Promise<Todo | null> {
        const todo = await TodoModel.findByPk(id);
        return todo ? (todo.toJSON() as Todo) : null;
    }

    async create(data: TodoCreationAttributes): Promise<Todo> {
        const todo = await TodoModel.create({
            title: data.title,
            description: data.description,
            completed: data.completed ?? false,
        });
        return todo.toJSON() as Todo;
    }

    async update(id: string, data: TodoUpdateAttributes): Promise<Todo | null> {
        const todo = await TodoModel.findByPk(id);
        if (!todo) {
            return null;
        }

        if (data.title !== undefined) {
            todo.title = data.title;
        }
        if (data.description !== undefined) {
            todo.description = data.description;
        }
        if (data.completed !== undefined) {
            todo.completed = data.completed;
        }

        await todo.save();
        return todo.toJSON() as Todo;
    }

    async delete(id: string): Promise<boolean> {
        const todo = await TodoModel.findByPk(id);
        if (!todo) {
            return false;
        }

        await todo.destroy();
        return true;
    }
}

export const todoService = new TodoService();
