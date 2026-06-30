import { NextResponse } from "next/server";
import { processarFila } from "@/scripts/worker";

export async function GET() {
  console.log("Cron Job disparado: Iniciando processamento...");

  try {
    await processarFila();
    console.log("Worker: Processamento finalizado com sucesso.");

    return NextResponse.json({ message: "Fila processada com sucesso" });
  } catch (error) {
    // É muito importante logar o erro real aqui para sabermos o que está acontecendo
    console.error("Worker: Erro crítico durante o processamento:", error);

    return NextResponse.json(
      { message: "Erro ao processar fila" },
      { status: 500 },
    );
  }
}
