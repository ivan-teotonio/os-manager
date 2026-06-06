import { NextRequest, NextResponse } from "next/server";
import {
  ServiceOrderService,
  ServiceOrderStatus,
} from "@/app/services/service-order.service";
import { verifyToken } from "@/app/lib/jwt";

const serviceOrderService = new ServiceOrderService();

function getUserId(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.id ?? null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const { status, observation } = await req.json();

    if (!status) {
      return NextResponse.json(
        { message: "status é obrigatório" },
        { status: 400 },
      );
    }

    const order = await serviceOrderService.updateStatus(
      Number(id),
      status as ServiceOrderStatus,
      userId,
      observation,
    );

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
