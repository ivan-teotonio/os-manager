import { prisma } from "../lib/prisma";

export class ClientService {
  async create(data: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  }) {
    return await prisma.client.create({ data });
  }

  async findAll(page = 1, limit = 10, search = "") {
    const offset = (page - 1) * limit;
    const where = {
      deletedAt: null,
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    };
    const [data, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.client.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: number) {
    const client = await prisma.client.findFirst({
      where: { id, deletedAt: null },
    });
    if (!client) throw new Error("Cliente não encontrado");
    return client;
  }

  async update(
    id: number,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      address: string;
    }>,
  ) {
    await this.findById(id);
    return await prisma.client.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.findById(id);
    await prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
