import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { Todo, TodoCreationAttributes } from '@monorepo/shared-types';

interface TodoInstance extends Model<Todo, TodoCreationAttributes>, Todo {}

let TodoModel: ModelStatic<TodoInstance> | null = null;

export const initTodoModel = (sequelize: Sequelize): ModelStatic<TodoInstance> => {
    if (!TodoModel) {
        TodoModel = sequelize.define<TodoInstance>(
            'Todo',
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                completed: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                    allowNull: false,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                tableName: 'todo_list_todos',
                timestamps: true,
            }
        ) as ModelStatic<TodoInstance>;
    }
    return TodoModel;
};

export const getTodoModel = (): ModelStatic<TodoInstance> => {
    if (!TodoModel) {
        throw new Error('TodoModel not initialized. Call initTodoModel first.');
    }
    return TodoModel;
};

export { TodoModel };
export default TodoModel;

