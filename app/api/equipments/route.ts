import { NextRequest, NextResponse } from "next/server";
import { EquipmentService } from "@/app/services/equipment.service";
import { verifyToken } from "@/app/lib/jwt";

const equipmentService = new EquipmentService();

function getUserId(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.id ?? null;
}

export async function GET(req: NextRequest) {
  try {
    if (!getUserId(req)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
    const clientId = req.nextUrl.searchParams.get("clientId");

    const result = await equipmentService.findAll(
      page,
      limit,
      clientId ? Number(clientId) : undefined,
    );
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!getUserId(req)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const { name, model, serialNumber, clientId } = await req.json();

    if (!name || !model || !serialNumber || !clientId) {
      return NextResponse.json(
        { message: "name, model, serialNumber e clientId são obrigatórios" },
        { status: 400 },
      );
    }

    const equipment = await equipmentService.create({
      name,
      model,
      serialNumber,
      clientId,
    });
    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Cliente não encontrado") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
