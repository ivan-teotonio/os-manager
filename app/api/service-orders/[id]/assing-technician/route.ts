import { NextRequest, NextResponse } from "next/server";
import { ServiceOrderService } from "@/app/services/service-order.service";
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
    const { technicianId } = await req.json();

    if (!technicianId) {
      return NextResponse.json(
        { message: "technicianId é obrigatório" },
        { status: 400 },
      );
    }

    const order = await serviceOrderService.assignTechnician(
      Number(id),
      technicianId,
      userId,
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
