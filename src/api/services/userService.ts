import prisma from "../../providers/prisma.provider.js";
import { QueryConverter } from "../../lib/queryConverter.js";
import { FilterCondition, FilterGroup } from "../../lib/types.js";

export class UserService {
  static async filterUsers(filters?: FilterGroup | FilterCondition) {
    // Convert validated filter into Prisma query
    const where = filters ? QueryConverter.convert(filters) : {};

    // Execute query with Prisma
    return prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }
}
