import { Router, Request, Response } from 'express';
import { todoService } from '../services/TodoService';
import { TodoCreationAttributes, TodoUpdateAttributes } from '../types/Todo';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy' });
});

router.get('/todos', async (req: Request, res: Response) => {
    try {
        const todos = await todoService.getAll();
        res.json({ success: true, data: todos });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch todos' });
    }
});

router.get('/todos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todo = await todoService.getById(id);
        
        if (!todo) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }
        
        res.json({ success: true, data: todo });
    } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch todo' });
    }
});

router.post('/todos', async (req: Request, res: Response) => {
    try {
        const data: TodoCreationAttributes = req.body;
        
        if (!data.title || data.title.trim() === '') {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }
        
        const todo = await todoService.create(data);
        res.status(201).json({ success: true, data: todo });
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ success: false, message: 'Failed to create todo' });
    }
});

router.put('/todos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data: TodoUpdateAttributes = req.body;
        
        const todo = await todoService.update(id, data);
        
        if (!todo) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }
        
        res.json({ success: true, data: todo });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ success: false, message: 'Failed to update todo' });
    }
});

router.delete('/todos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await todoService.delete(id);
        
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }
        
        res.json({ success: true, message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ success: false, message: 'Failed to delete todo' });
    }
});

export { router };
