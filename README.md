# Shift Cipher Brute Force Analyzer

A professional web-based cryptanalysis tool for decoding shift cipher encrypted messages using brute force techniques and intelligent frequency analysis.

## 🎯 Features

- **Brute Force Decryption**: Automatically tests all 26 possible shift values
- **Multi-Language Support**: Detects and analyzes English, Kinyarwanda, and French
- **Intelligent Scoring**: Uses frequency analysis and word matching for accurate results
- **Cipher Encoder**: Encrypt messages with custom shift keys
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Export Results**: Save decoded messages as JSON files
- **Real-time Analysis**: Fast decryption with confidence scoring

## 🛠️ Technology Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Framer Motion for animations
- Axios for API calls

### Backend
- Node.js with Express
- Frequency analysis algorithms
- Multi-language word validation
- RESTful API architecture

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/bosco250/bruteforce-cryptanalysis.git
cd bruteforce-cryptanalysis
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables:

Create `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development
```

Create `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

## 🎮 Usage

### Start the Backend Server

```bash
cd server
npm start
```

The server will run on `http://localhost:5000`

### Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📖 How It Works

### Decoder
1. Paste your encrypted message in the input field
2. Click "Decode Message"
3. The system automatically:
   - Tests all 26 shift values
   - Detects the language (English, Kinyarwanda, French)
   - Analyzes letter frequency patterns
   - Matches against common words
   - Ranks results by confidence score
4. View decoded messages sorted by likelihood

### Encoder
1. Enter your plain text message
2. Set a shift key (1-25)
3. Click "Encode"
4. Copy or download the encrypted message

## 🔍 Algorithm Details

The system uses multiple scoring factors:

- **Frequency Analysis** (50%): Compares letter distribution with language patterns
- **Word Matching** (50%): Validates against common word dictionaries
- **Readability Patterns**: Checks for natural language characteristics
- **Vowel Ratio**: Ensures appropriate vowel distribution

## 📁 Project Structure

```
bruteforce-cryptanalysis/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Theme context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── routes/             # API routes
│   └── server.js
├── tools/                  # Training utilities
└── README.md
```

## 🎓 Educational Purpose

This project demonstrates:
- Cryptanalysis techniques
- Frequency analysis algorithms
- Multi-language text processing
- Full-stack JavaScript development
- RESTful API design
- Modern React patterns

## 👨‍💻 Author

**Bosco Dev**
- Level 4 Computer Science
- University of Rwanda

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Note**: This tool is designed for educational purposes to understand cryptanalysis and shift cipher algorithms.
