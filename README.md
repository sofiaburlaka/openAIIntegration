```markdown
# OpenAI Integration Project

This is a simple web application with a React frontend and an Express backend that integrates with the OpenAI API to perform text operations: summarization, rephrasing, classification, and JSON extraction. The app uses reusable prompts from OpenAI and supports tone selection for rephrasing.

---

## Features

- User inputs text.
- Selects text processing mode:
  - summarize — summarize the text
  - rephrase — rephrase the text (with tone selection: casual, professional, friendly)
  - classify — classify the text
  - extract_json — extract JSON from text (pretty-printed in the UI)
- Backend calls OpenAI Responses API with the appropriate reusable prompt based on the selected mode.
- Displays the result on the interface.
- Shows token usage information (prompt tokens, completion tokens, total tokens).
- Copy result button.

---

## Technical Architecture

- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express
- **OpenAI API:** Responses API, reusable prompts

---

## Getting Started

### Setup

1. Obtain an OpenAI API key and save it in a `.env` file in the project root:

```
OPENAI_API_KEY=your_openai_api_key_here
```

2. Install dependencies:

```
npm install
```

### Run

```
npm run start
```

- The server will run on `http://localhost:3000`.
- The frontend will be accessible at the same address.

---

## Project Structure

```
/frontend - React application
/backend  - Express server with OpenAI integration
.env      - file with API key
```

---

## Usage

- Enter text into the input field.
- Select one of the processing modes.
- If you select **rephrase**, choose the tone (casual, professional, friendly).
- Click the "Submit" button.
- The result will appear below the form.
- For extract_json, the result is displayed in a formatted way.
- Token usage statistics are shown below the result.
- The "Copy result" button copies the result to clipboard.

---

## Reusable Prompts Configuration

In the backend `/api/run` file, reusable prompt IDs are configured for each mode:

```
const PROMPTS = {
  summarize: "pmpt...",
  rephrase: "pmpt...",
  classify: "pmpt...",
  extract_json: "pmp...",
};
```

---

## Implementation Details

- For `rephrase` mode, the `tone` variable (casual, professional, friendly) is passed in `prompt.variables` and used in the reusable prompt.
- Optional chaining is used for safe handling of OpenAI responses.
- Error handling returns proper messages to the frontend.

---

## Requirements

- Node.js v18+
- Current version of npm/yarn
- OpenAI API key

---

## Future Improvements

- User authentication integration
- User query history
- Support for additional models and configurations
- Expansion of text processing modes

---

## Author

Sofia Burlaka
---

Thank you for using this application!
```
