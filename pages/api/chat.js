import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Clave de API no configurada en Vercel" });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "Eres un asistente útil." }, { role: "user", content: message }],
      temperature: 0.7,
    });

    if (!response.choices || response.choices.length === 0) {
      return res.status(500).json({ error: "OpenAI no devolvió respuesta" });
    }

    return res.status(200).json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error en OpenAI:", error);
    return res.status(500).json({ error: "Error al obtener respuesta de OpenAI" });
  }
}

