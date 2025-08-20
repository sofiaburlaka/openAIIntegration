import express from 'express';
import OpenAI from 'openai';
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    });

const app = express();

app.use(express.static('frontend/dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PROMPTS = {
    summarize: "pmpt_68a57c1c0f0881968e23789749e398d7003acf55bc2a8efb",
    rephrase: "pmpt_68a58eecbb3481978b8c9ddd9fe4d49d0da6ba3dd23f0fa9",
    classify: "pmpt_68a590be7f848193bb88221280bb357e03c0c1972e8e6fcd",
    extract_json: "pmpt_68a592ec274c8193a383a24ba819320608c6c3fce97be697",
};

app.post("/api/run", async (req, res) => {
    try {
        const { text, mode, tone } = req.body;

        if (!text || !mode) {
            return res.status(400).json({ error: "Text and mode are required" });
        }

        if (mode === "rephrase" && !tone) {
            return res.status(400).json({ error: "Tone is required for rephrase mode" });
        }

        // Формуємо об'єкт prompt для reusable prompt
        const prompt = {
            id: PROMPTS[mode],
        };

        if (mode === "rephrase") {
            prompt.variables = { tone: tone };
        }

        const body = {
            model: "gpt-5",  // або інша доступна модель
            prompt: prompt,
            input: text,
        };

        const response = await openai.responses.create(body);

        // Відповідь може бути в різних полях, перевіряємо безпечно
        const result =
            response.output_text ??
            response.completion ??
            (response.output && response.output[0] && response.output.content && response.output.content?.text) ??
            "";

        // Юзедж токенів
        const usage = response.usage ?? null;

        res.json({ result, usage });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});
// app.post('/:userText', async (req, res) => {
//     var userText = req.params.userText;
//
//     //call openai API
//     const completion = await openai.chat.completions.create({
//         messages: [{role:"system", content: userText}],
//         model: "gpt-5",
//     });
//
//     res.json(completion.choices[0].message.content);
// });

app.listen(3000, () => console.log('Listening on port 3000'));
