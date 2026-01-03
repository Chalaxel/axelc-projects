import { Router, Request, Response } from 'express';
import { todoService } from '../services/TodoService';
import { TodoCreationAttributes, TodoUpdateAttributes } from '@shared/types/Todo';
import { sessionService } from '../services/SessionService';
import { SessionCreationAttributes } from '@shared/types';

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

router.get('/sessions', async (req: Request, res: Response) => {
    try {
        const sessions = await sessionService.getAll();
        res.json({ success: true, data: sessions });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch sessions' });
    }
});

router.get('/sessions/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const session = await sessionService.getById(id);
        
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        
        res.json({ success: true, data: session });
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch session' });
    }
});

router.post('/sessions', async (req: Request, res: Response) => {
    try {
        const data: SessionCreationAttributes = req.body;
        
        if (!data.sport) {
            return res.status(400).json({ success: false, message: 'Sport is required' });
        }
        
        const session = await sessionService.create(data);
        res.status(201).json({ success: true, data: session });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ success: false, message: 'Failed to create session' });
    }
});

router.put('/sessions/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data: Partial<SessionCreationAttributes> = req.body;
        
        const session = await sessionService.update(id, data);
        
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        
        res.json({ success: true, data: session });
    } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({ success: false, message: 'Failed to update session' });
    }
});

router.delete('/sessions/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await sessionService.delete(id);
        
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        
        res.json({ success: true, message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ success: false, message: 'Failed to delete session' });
    }
});

export { router };
