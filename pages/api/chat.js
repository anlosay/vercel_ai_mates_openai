export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    return res.status(500).json({ error: "Clave de API no configurada en Vercel" });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }]
      }),
    });

    const data = await response.json();

    if (!data || !data.candidates || data.candidates.length === 0) {
      return res.status(500).json({ error: "No se recibió respuesta de Gemini" });
    }

    return res.status(200).json({ response: data.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error("Error en la API de Gemini:", error);
    return res.status(500).json({ error: "Error al obtener respuesta de Gemini" });
  }
}
