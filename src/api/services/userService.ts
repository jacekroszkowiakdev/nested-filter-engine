import  prisma  from '../../providers/prisma.provider.js';
import { UserFilter } from '../models/userFilter.js';
import { generateFilterSchema } from '../../decorators/generateFilterSchema.js';
import { QueryConverter } from '../../lib/queryConverter.js';


export class UserService {
    static async filterUsers(filterPayload: Partial<UserFilter>) {
        const schema: any = generateFilterSchema(UserFilter);

        const where = QueryConverter.convert(schema);

    // Run query
        const users = await prisma.user.findMany({ where });
        return users;
    }
}