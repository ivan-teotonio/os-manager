import { prisma } from "@/app/lib/prisma";

export type ServiceOrderStatus =
  | "ABERTA"
  | "EM_ANDAMENTO"
  | "CONCLUIDA"
  | "CANCELADA";
export type ServiceOrderPriority = "BAIXA" | "MEDIA" | "ALTA";

const VALID_TRANSITIONS: Record<ServiceOrderStatus, ServiceOrderStatus[]> = {
  ABERTA: ["EM_ANDAMENTO", "CANCELADA"],
  EM_ANDAMENTO: ["CONCLUIDA", "CANCELADA"],
  CONCLUIDA: [],
  CANCELADA: [],
};

export class ServiceOrderService {
  async create(data: {
    title: string;
    description: string;
    priority: ServiceOrderPriority;
    clientId: number;
    openedById: number;
    technicianId?: number;
    equipmentId?: number;
  }) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.serviceOrder.create({ data });

      await tx.serviceOrderHistory.create({
        data: {
          serviceOrderId: order.id,
          changedById: data.openedById,
          previousStatus: null,
          newStatus: "ABERTA",
          observation: "Ordem de serviço aberta",
        },
      });

      return order;
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: {
      status?: ServiceOrderStatus;
      clientId?: number;
      technicianId?: number;
    } = {},
  ) {
    const offset = (page - 1) * limit;
    const where = { ...filters };

    const [data, total] = await Promise.all([
      prisma.serviceOrder.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          client: { select: { name: true } },
          technician: { select: { name: true } },
        },
      }),
      prisma.serviceOrder.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: number) {
    const order = await prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        client: { select: { name: true } },
        technician: { select: { name: true } },
        equipment: { select: { name: true } },
        openedBy: { select: { name: true } },
        history: {
          orderBy: { createdAt: "asc" },
          include: { changedBy: { select: { name: true } } },
        },
      },
    });
    if (!order) throw new Error("Ordem de serviço não encontrada");
    return order;
  }

  async assignTechnician(id: number, technicianId: number, userId: number) {
    const order = await this.findById(id);
    if (order.status !== "ABERTA") {
      throw new Error("Só é possível atribuir técnico em OS com status ABERTA");
    }

    return await prisma.$transaction(async (tx) => {
      const updated = await tx.serviceOrder.update({
        where: { id },
        data: { technicianId, status: "EM_ANDAMENTO" },
      });

      await tx.serviceOrderHistory.create({
        data: {
          serviceOrderId: id,
          changedById: userId,
          previousStatus: "ABERTA",
          newStatus: "EM_ANDAMENTO",
          observation: "Técnico atribuído",
        },
      });

      return updated;
    });
  }

  async updateStatus(
    id: number,
    newStatus: ServiceOrderStatus,
    userId: number,
    observation?: string,
  ) {
    const order = await this.findById(id);
    const allowed = VALID_TRANSITIONS[order.status as ServiceOrderStatus];

    if (!allowed.includes(newStatus)) {
      throw new Error(`Transição inválida: ${order.status} → ${newStatus}`);
    }

    return await prisma.$transaction(async (tx) => {
      const updated = await tx.serviceOrder.update({
        where: { id },
        data: {
          status: newStatus,
          concludedAt: newStatus === "CONCLUIDA" ? new Date() : undefined,
        },
      });

      await tx.serviceOrderHistory.create({
        data: {
          serviceOrderId: id,
          changedById: userId,
          previousStatus: order.status,
          newStatus,
          observation: observation ?? null,
        },
      });

      return updated;
    });
  }

  async addObservation(id: number, userId: number, observation: string) {
    const order = await this.findById(id);
    if (order.status === "CONCLUIDA" || order.status === "CANCELADA") {
      throw new Error("Não é possível adicionar observação em OS finalizada");
    }

    await prisma.serviceOrderHistory.create({
      data: {
        serviceOrderId: id,
        changedById: userId,
        previousStatus: order.status,
        newStatus: order.status,
        observation,
      },
    });

    return { message: "Observação adicionada" };
  }
}
