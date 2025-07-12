# 🎓 AI-Powered Interactive Learning Assistant

An intelligent web application that assists students with subject-related queries using voice, text, or visual input. It uses natural language processing (NLP) to generate answers in real time with the help of a locally running LLM via Ollama.


PPT : https://docs.google.com/presentation/d/1Tmyl4seUvtXvLyQQ3nHrzSazt-CimzYH/edit?usp=sharing&ouid=116693502915413489920&rtpof=true&sd=true
Demo : https://drive.google.com/file/d/1t39i0bgkhmVleRThM0ZNY3iFekM1-XAT/view?usp=sharing

## 🚀 Features

- 🔍 **Text-Based Chat**: Ask any academic question via text input.
- 🎤 **Voice Input**: Speak your question using microphone input (via Web Speech API).
- 📸 **Camera & Image Upload**: Capture or upload an image for visual queries.
- 🧠 **Real-Time Answers**: Responses generated using a pretrained Large Language Model (Mistral or similar) via Ollama backend.
- 🔐 **Password Reset Support**: Includes form to request password reset via backend API.

## 🛠️ Technologies Used

### Frontend
- HTML, CSS, JavaScript
- DOM Manipulation for dynamic chat interface
- Web APIs: 
  - `navigator.mediaDevices.getUserMedia` for camera
  - Web Speech API for voice
  - `FileReader` API for image preview

### Backend
- Node.js + Express.js
- Ollama (for running LLM like Mistral or LLaMA2 locally)
- API Endpoints for:
  - Answering questions (`/ask`)
  - Handling password resets (`/send-reset`)

## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/ai-classroom-assistant.git
   cd ai-classroom-assistant
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Start Ollama & Backend**
   - Make sure Ollama is running and the model (e.g., `mistral`) is pulled:
     ```bash
     ollama run mistral
     ```
   - Then run the backend server:
     ```bash
     node index.js
     ```

4. **Open Frontend**
   - Open `index.html` in your browser.
   - Ensure microphone and camera permissions are granted.

## 📁 Project Structure

```
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── backend/
│   ├── index.js
│   └── package.json
└── README.md
```

## 🧪 How to Use

1. Type your question in the input field and hit send.
2. Click the microphone icon to speak your query.
3. Use the camera or upload an image to ask a visual question.
4. Responses will appear in the chat window with simulated typing.

## 📌 Notes

- LLM responses are generated via a local Ollama server.
- If Ollama is not running, fetch errors will occur.
- Responses are limited to the first 3000 characters for readability.


