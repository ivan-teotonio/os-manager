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

export async function GET(req: NextRequest) {
  try {
    if (!getUserId(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
    const search = req.nextUrl.searchParams.get("search") || "";

    const result = await clientService.findAll(page, limit, search);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!getUserId(req)) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const { name, email, phone, address } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { message: "name, email e phone são obrigatórios" },
        { status: 400 },
      );
    }

    const client = await clientService.create({ name, email, phone, address });
    return NextResponse.json(client, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
