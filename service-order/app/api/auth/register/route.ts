import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/app/services/auth.service";

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "name, email e password são obrigatórios" },
        { status: 400 },
      );
    }

    const user = await authService.register({ name, email, password });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Email já está em uso") {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
