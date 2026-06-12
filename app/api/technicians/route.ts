import { NextRequest, NextResponse } from "next/server";
import { TechnicianService } from "@/app/services/technician.service";
import { verifyToken } from "@/app/lib/jwt";

const technicianService = new TechnicianService();

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
    const search = req.nextUrl.searchParams.get("search") || "";

    const result = await technicianService.findAll(page, limit, search);
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
    const { name, email, phone, specialty } = await req.json();

    if (!name || !email || !phone || !specialty) {
      return NextResponse.json(
        { message: "name, email, phone e specialty são obrigatórios" },
        { status: 400 },
      );
    }

    const technician = await technicianService.create({
      name,
      email,
      phone,
      specialty,
    });
    return NextResponse.json(technician, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
