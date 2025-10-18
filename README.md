# 🔮 AI Text Archaeologist

> Reconstructing fragmented internet messages from early 2000s culture using AI and contextual web research

![Project Banner](imgs/banner.png)

## 📖 Overview

AI Text Archaeologist is an intelligent system that reconstructs fragmented internet messages (slang, acronyms, and incomplete phrases from 2000s-2010s internet culture) into coherent, modern English sentences. It uses advanced AI to understand context, expand slang, and provide relevant historical sources.

### ✨ Key Features

- **🤖 AI-Powered Reconstruction** - Leverages Google Gemini 2.5 Flash to intelligently reconstruct fragmented messages
- **🔍 Contextual Research** - Automatically searches and retrieves relevant sources explaining cultural references
- **🌐 Web Interface** - Clean React frontend for easy interaction
- **📚 Historical Context** - Provides links to definitions and explanations of internet slang and cultural phenomena
- **⚡ Fast Processing** - Efficient API design with Flask backend

## 🛠️ Technology Stack

**Frontend:**
- React + Vite
- Modern JavaScript (ES6+)

**Backend:**
- Python 3.x
- Flask (REST API)
- Google Generative AI (Gemini)
- Serper API (Web Search)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- Google Gemini API Key
- Serper API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LazyHusky26/SOTY_Hackathon.git
   cd SOTY_Hackathon
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables**
   
   Copy `.env.example` to `.env` and add your API keys:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   SERPER_API_KEY=your_serper_api_key_here
   ```
   **⚠️ Important**: 
- Never commit your `.env` file (it's already in `.gitignore`)
- Get your Gemini API key from [ai.google.dev](https://makersuite.google.com/app/apikey)
- Get your Serper API key from [serper.dev](https://serper.dev/)

### Running the Application

1. **Start the Flask backend**
   ```bash
   python api.py
   ```
   Server runs on: `http://localhost:5000`

2. **Start the React frontend** (in a new terminal)
   ```bash
   npm run dev
   ```
   App runs on: `http://localhost:5173`

## 💡 Usage

1. Enter a fragmented message (e.g., "smh Top 8 drama g2g")
2. Click "Reconstruct"
3. View the AI-reconstructed message in modern English
4. Explore contextual sources explaining cultural references

### Example

**Input:**
```
smh Top 8 drama g2g
```

**Output:**
```
Shaking my head at the drama surrounding MySpace Top 8 rankings; I've got to go.
```

**Sources Provided:**
- Urban Dictionary: "smh" definition
- Know Your Meme: MySpace Top 8 culture
- Wikipedia: Early social networking history

## 📁 Project Structure

```
SOTY_Hackathon/
├── src/                    # React frontend source
│   └── main.jsx           # React entry point
├── imgs/                   # Project images and assets
├── api.py                  # Flask REST API server
├── main.py                 # Core reconstruction logic
├── index.html              # HTML entry point
├── package.json            # Node dependencies
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
└── README.md              # Documentation
```

## 🔌 API Endpoints

### POST `/api/reconstruct`
Reconstructs fragmented text and retrieves contextual sources.

**Request:**
```json
{
  "fragment": "smh g2g brb"
}
```

**Response:**
```json
{
  "original": "smh g2g brb",
  "reconstructed": "Shaking my head, I've got to go, but I'll be right back.",
  "sources": [
    {
      "link": "https://www.urbandictionary.com/define.php?term=smh",
      "description": "Internet slang meaning 'shaking my head'..."
    }
  ]
}
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).


## 🙏 Acknowledgments

- Google Gemini AI for powerful language understanding
- Serper API for web search capabilities
- The internet culture historians who documented early 2000s phenomena

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/LazyHusky26/SOTY_Hackathon/issues).

---

**Built with ❤️ for SOTY Hackathon**
