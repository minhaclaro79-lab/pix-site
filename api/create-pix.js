import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    console.log("📤 Iniciando criação do pagamento PIX...");

    const { amount } = req.body;

    const body = {
      amount: amount || 990,
      payment_method: "pix",
      offer_id: 10601,
      product_id: 7562,
      name: "Cliente Teste",
      document: "23745874870",
      email: "teste@cliente.com",
      description: "Compra - CONTEÚDO VIP ANA CAROLINA",
    };

    const response = await fetch(process.env.PEPPER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PEPPER_BEARER_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("📥 Resposta PepperPay:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erro ao gerar pagamento Pix",
        details: data,
      });
    }

    const pixCode =
      data.pix_payload ||
      data.copy_paste ||
      data.qr_code_payload ||
      data.data?.payload ||
      "Pix não retornado";

    res.status(200).json({ pix: pixCode });
  } catch (error) {
    console.error("❌ Erro interno:", error);
    res.status(500).json({ error: "Erro interno", details: error.message });
  }
}
