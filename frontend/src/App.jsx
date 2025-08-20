import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import axios from "axios";

    function App() {
        const [text, setText] = useState("");
        const [mode, setMode] = useState("summarize");
        const [tone, setTone] = useState("casual");
        const [answer, setAnswer] = useState("");
        const [usage, setUsage] = useState(null);
        const [error, setError] = useState("");

        async function handleSubmit(evt) {
            evt.preventDefault();
            setError("");
            setAnswer("");
            setUsage(null);

            try {
                const response = await axios.post("http://localhost:3000/api/run", {
                    text,
                    mode,
                    tone: mode === "rephrase" ? tone : undefined,
                });

                if (mode === "extract_json") {
                    // Форматуємо JSON красиво
                    try {
                        const jsonObj = JSON.parse(response.data.result);
                        setAnswer(JSON.stringify(jsonObj, null, 2));
                    } catch {
                        setAnswer(response.data.result);
                    }
                } else {
                    setAnswer(response.data.result);
                }

                setUsage(response.data.usage);
            } catch (err) {
                setError(err.response?.data?.error || "Error communicating with API");
            }
        }

        function copyResult() {
            navigator.clipboard.writeText(answer);
        }

        return (
            <div className="container mt-3">
                <h1>OpenAI Integration</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="textInput" className="form-label">
                            Введіть ваш текст
                        </label>
                        <textarea
                            id="textInput"
                            className="form-control"
                            rows={4}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Оберіть режим</label>
                        <select
                            className="form-select"
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                        >
                            <option value="summarize">Summarize</option>
                            <option value="rephrase">Rephrase</option>
                            <option value="extract_json">Extract JSON</option>
                            <option value="classify">Classify</option>
                        </select>
                    </div>

                    {mode === "rephrase" && (
                        <div className="mb-3">
                            <label className="form-label">Виберіть тон</label>
                            <select
                                className="form-select"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                            >
                                <option value="casual">Casual</option>
                                <option value="professional">Professional</option>
                                <option value="friendly">Friendly</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary">
                        Відправити
                    </button>
                </form>

                {error && <div className="text-danger mt-3">{error}</div>}

                {answer && (
                    <div className="mt-3">
                        <h3>Результат:</h3>
                        {mode === "extract_json" ? (
                            <pre style={{ whiteSpace: "pre-wrap" }}>{answer}</pre>
                        ) : (
                            <p>{answer}</p>
                        )}
                        <button className="btn btn-secondary mt-2" onClick={copyResult}>
                            Copy result
                        </button>
                    </div>
                )}
                <footer className='mt-3' >
                    {usage && (
                        <div className="mt-3">
                            <h4>Token usage:</h4>
                            <p>Prompt tokens: {usage.prompt_tokens}</p>
                            <p>Completion tokens: {usage.completion_tokens}</p>
                            <p>Total tokens: {usage.total_tokens}</p>
                        </div>
                    )}
                </footer>
            </div>
        );
    }
// function App() {
//   const [text, setText] = useState("");
//   const [answer, setAnswer] = useState("");
//
//   async function handleSubmit(evt) {
//       evt.preventDefault();
//       const data = await axios.post(`http://localhost:3000/${text}`);
//       console.log(JSON.stringify(data));
//       setAnswer(data.data);
//   }
//
//   return (
//     <>
//         <div className="container">
//             <h1>OpenAi Intergration</h1>
//             <form>
//                 <label className='form-label' htmlFor='txtText'>Введіть ваш текст нижче</label>
//                 <input className='form-control' type='text' id='txtText' name='txtText' onChange={(evt) => setText(evt.target.value)} />
//                 <button className='btn btn-primary mt-3' onClick={(evt) => handleSubmit(evt)}>Run</button>
//                 {answer && <h2 className='text-danger'>{answer}</h2>}
//             </form>
//         </div>
//     </>
//   )
// }

export default App;
