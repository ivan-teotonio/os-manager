import { NextRequest, NextResponse } from "next/server";
import { ClientService } from "@/app/services/client.service";
import { verifyToken } from "@/app/lib/jwt";

const clientService = new ClientService();

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
    const client = await clientService.findById(Number(id));
    return NextResponse.json(client);
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!getUserId(req)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const data = await req.json();
    const client = await clientService.update(Number(id), data);
    return NextResponse.json(client);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!getUserId(req)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const { id } = await params;
    await clientService.delete(Number(id));
    return new NextResponse(null, { status: 204 });
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
