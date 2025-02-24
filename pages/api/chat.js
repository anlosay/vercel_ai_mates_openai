import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API Key no configurada" });
  }

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Mensaje vacío" });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un tutor de matemáticas. Siempre que respondas con ecuaciones, usa formato LaTeX dentro de delimitadores `$$ ... $$` para ecuaciones en bloque y `$ ... $` para ecuaciones en línea." },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    res.status(200).json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error en OpenAI:", error);
    res.status(500).json({ error: "Error en la API de OpenAI" });
  }
}
