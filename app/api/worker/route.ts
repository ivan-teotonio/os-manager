import { NextResponse } from "next/server";
import { processarFila } from "@/scripts/worker"; // Você precisará exportar a função do seu arquivo

export async function GET() {
  try {
    await processarFila();
    return NextResponse.json({ message: "Fila processada com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao processar fila" },
      { status: 500 },
    );
  }
}
