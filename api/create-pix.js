export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // 🔒 Sempre mantenha seu token em variável de ambiente
    const token = process.env.PEPPER_TOKEN;
    if (!token) {
      throw new Error("Token da Pepper não configurado");
    }

    // ⚙️ Corpo base para gerar o Pix (substitua pelos dados reais do seu checkout)
    const body = {
      offer_hash: "brzgj",
      customer: {
        name: "Cliente Teste",
        email: "cliente"+Date.now()+"@teste.com",
        document: "00000000000", // apenas exemplo
        phone_number: "11999999999"
      },
      payment_method: 3, // 3 = PIX
      installments: 1,
      tracking: {},
      cart: [
        {
          product_hash: "ehqoxdvpi3",
          quantity: 1
        }
      ]
    };

    // 🔗 Chamada à API da Pepper
    const response = await fetch("https://api.pepper.com.br/api/transactions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da API Pepper:", data);
      return res.status(response.status).json({ error: data });
    }

    // Retorna o QR Code Pix ou o código copia e cola
    return res.status(200).json({
      pix_code: data?.transaction?.payment_data?.pix_qr_code || null,
      full_response: data
    });

  } catch (error) {
    console.error("Erro ao gerar Pix:", error);
    return res.status(500).json({ error: "Erro interno ao gerar Pix" });
  }
}
