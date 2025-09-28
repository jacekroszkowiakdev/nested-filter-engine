import { Request, Response, Router } from 'express';
import { UserService } from '../services/userService.js';

const router = Router();

export class UserController {
    static async filterUsers(req: Request, res: Response) {
        try {
            const filteredResult = await UserService.filterUsers(req.body);
            res.status(200).json(filteredResult);
        } catch (error) {
            console.error('[UserController] filterUsers error:', error);

            const errorMessage = (error instanceof Error) ? error.message : String(error);
            res.status(400).json({ error: 'Internal Server Error', details: errorMessage });
        }
    }
}

router.post('/users/filter', UserController.filterUsers);

export default router;