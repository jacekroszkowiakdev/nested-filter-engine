import { Request, Response, Router } from 'express';
import { UserService } from '../services/userService.js';
import { Validator } from "../../lib/validator.js";
import { generateFilterSchema } from "../../decorators/generateFilterSchema.js";
import { UserFilter } from '../models/userFilter.js';


const router = Router();
const schema = generateFilterSchema(UserFilter);
const validator = new Validator(schema);

export class UserController {
    static async filterUsers(req: Request, res: Response) {
        try {
            let filters;



            if (req.method === 'GET') {
                const filterParam = req.query.filter;

                if (!filterParam) {
                    // No filter = return all results
                const allUsers = await UserService.getAllUsers();
                return res.status(200).json(allUsers);
                }

                try {
                    filters = JSON.parse(filterParam as string);
                } catch {
                    return res.status(400).json({ error: 'Invalid filter JSON in query param' });
                }
            } else {
                filters = req.body;
            }

            validator.validate(filters);
            const filteredResult = await UserService.filterUsers(filters);

            res.status(200).json(filteredResult);
        } catch (error) {
            console.error('[UserController] filterUsers error:', error);

            const errorMessage = (error instanceof Error) ? error.message : String(error);
            res.status(400).json({ error: 'Internal Server Error', details: errorMessage });
        }
    }
}

router.post('/users/filter', UserController.filterUsers);
router.get("/users/filter", UserController.filterUsers);

export default router;