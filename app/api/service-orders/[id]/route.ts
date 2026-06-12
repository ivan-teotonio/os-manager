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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!getUserId(req)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const order = await serviceOrderService.findById(Number(id));
    return NextResponse.json(order);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Ordem de serviço não encontrada"
    ) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
