export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Dados enviados pelo frontend
    const { amount } = req.body;

    // Simula criação do Pix (mock)
    const fakePix = {
      amount,
      code: "00020126360014BR.GOV.BCB.PIX0114+5511999999995204000053039865802BR5920NOME DO RECEBEDOR6009SAO PAULO62070503***6304ABCD",
    };

    // Retorna o código Pix gerado
    res.status(200).json(fakePix);
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: "Erro interno ao gerar Pix" });
  }
}
