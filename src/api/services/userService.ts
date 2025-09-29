import  prisma  from '../../providers/prisma.provider.js';
import { QueryConverter } from '../../lib/queryConverter.js';
import { FilterCondition, FilterGroup } from '../../lib/types.js';


export class UserService {
  static async filterUsers(filters: FilterGroup | FilterCondition) {
    // Convert validated filter into Prisma query
    const prismaQuery = QueryConverter.convert(filters);

    // Execute query with Prisma
    return prisma.user.findMany({
      where: prismaQuery,
      orderBy: { createdAt: "desc" }, // optional: consistent ordering
    });
  }
}