import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { triathlonPlanService } from '../services/TriathlonPlanService';
import { GoalAttributes, UserProfile } from '@shared/types';
import { UserService } from 'src/services/UserService';

const router = Router();

router.get('/current', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Non autorisé' });
        const plan = await triathlonPlanService.getCurrentPlan(req.user.userId);
        res.json({ success: true, data: plan });
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch plan' });
    }
});

router.post('/generate', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Non autorisé' });
        const { distance, weeklyHours, startDate, endDate } = req.body;

        if (!distance || !weeklyHours || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const plan = await triathlonPlanService.createPlan(req.user.userId, {
            distance,
            weeklyHours,
            startDate,
            endDate,
        });

        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        console.error('Error generating plan:', error);
        res.status(500).json({ success: false, message: 'Failed to generate plan' });
    }
});

router.put('/profile', async (req: AuthenticatedRequest<UserProfile>, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Non autorisé' });
        const user = await triathlonPlanService.updateUserProfile(req.user.userId, req.body);
        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
});

router.post('/goal', async (req: AuthenticatedRequest<GoalAttributes>, res: Response) => {
    try {
        if (!req.user) {
            return res
                .status(401)
                .json({ success: false, message: 'Non autorisé - Session expirée ou invalide' });
        }
        const user = await triathlonPlanService.addGoal(req.user.userId, req.body);
        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Error adding goal:', error);
        res.status(500).json({ success: false, message: 'Failed to add goal' });
    }
});

router.put('/goal', async (req: AuthenticatedRequest<GoalAttributes>, res: Response) => {
    if (!req.user) {
        return res
            .status(401)
            .json({ success: false, message: 'Non autorisé - Session expirée ou invalide' });
    }

    await UserService.addGoal(req.user.userId, req.body);
    return res.status(200).json({ success: true, message: 'Goal updated successfully' });
});

router.post('/goal/:date/resetPeriods', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res
                .status(401)
                .json({ success: false, message: 'Non autorisé - Session expirée ou invalide' });
        }
        const user = await UserService.getUserById(req.user.userId);

        const dateStr = req.params.date;
        const date = new Date(dateStr);

        const goalToReset = user?.goals.find(goal => {
            const goalDate = new Date(goal.raceDate);

            return goalDate.toDateString() === date.toDateString();
        });

        if (!goalToReset) {
            return res.status(404).json({ success: false, message: 'Goal not found' });
        }

        res.json({ success: true, message: 'Goal periods reset successfully', goalToReset });
    } catch (error) {
        console.error('Error resetting goal periods:', error);
        res.status(500).json({ success: false, message: 'Failed to reset goal periods' });
    }
});

router.delete('/current', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Non autorisé' });
        await triathlonPlanService.deleteCurrentPlan(req.user.userId);
        res.json({ success: true, message: 'Plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).json({ success: false, message: 'Failed to delete plan' });
    }
});

export { router as planRouter };
