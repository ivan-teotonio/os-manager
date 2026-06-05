import { prisma } from "@/app/lib/prisma";

export class TechnicianService {
  async create(data: {
    name: string;
    email: string;
    phone: string;
    specialty: string;
  }) {
    return await prisma.technician.create({ data });
  }

  async findAll(page = 1, limit = 10, search = "") {
    const offset = (page - 1) * limit;
    const where = {
      deletedAt: null,
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { specialty: { contains: search, mode: "insensitive" as const } },
      ],
    };

    const [data, total] = await Promise.all([
      prisma.technician.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.technician.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: number) {
    const technician = await prisma.technician.findFirst({
      where: { id, deletedAt: null },
    });
    if (!technician) throw new Error("Técnico não encontrado");
    return technician;
  }

  async update(
    id: number,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      specialty: string;
    }>,
  ) {
    await this.findById(id);
    return await prisma.technician.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.findById(id);
    await prisma.technician.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
