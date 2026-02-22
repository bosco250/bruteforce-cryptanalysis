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

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/bosco250/bruteforce-cryptanalysis.git
cd bruteforce-cryptanalysis
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../server
npm install
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

## 🌐 Deploy to Vercel

### Quick Deploy Steps

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/bosco250/bruteforce-cryptanalysis.git
git branch -M main
git push -u origin main
```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

### Features on Vercel

✅ Frontend and Backend deployed together
✅ Automatic HTTPS
✅ Global CDN
✅ Serverless functions for backend
✅ Zero configuration needed

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

## 🔍 How the Decryption Algorithm Works

This project uses a combination of classical cryptanalysis techniques to automatically crack Caesar cipher encrypted messages. Think of it as a smart detective that tries every possible key and then uses multiple clues to figure out which decryption makes the most sense.

### The Big Picture

When you paste an encrypted message, the system:
1. Tries all 26 possible shift keys (brute force)
2. Analyzes each result using statistical methods
3. Ranks them by confidence score
4. Shows you the most likely plaintext first

### Step 1: Brute Force Attack

The Caesar cipher only has 26 possible keys (one for each letter of the alphabet), so we can simply try them all. This is called an exhaustive key search.

**What happens:**
- The system shifts each letter backward by 0, then 1, then 2... all the way to 25
- For example, if the ciphertext is "KHOOR", shifting by 3 gives "HELLO"
- Each decryption is saved along with its shift value
- This takes almost no time even for long messages

**Why it works:**
- Unlike modern encryption (which might have billions of possible keys), Caesar cipher is weak
- Testing all 26 possibilities is trivial for a computer
- The challenge isn't finding possibilities—it's identifying the correct one

### Step 2: Frequency Analysis (The Statistical Detective)

This is where the magic happens. Every language has a unique "fingerprint" based on how often each letter appears. In English, the letter 'E' shows up about 12.7% of the time, while 'Z' appears less than 0.1% of the time.

**What the algorithm does:**
- Counts how often each letter appears in the decrypted text
- Compares this pattern to known language patterns using a chi-squared test
- The closer the match, the more likely it's the correct decryption

**Language patterns we use:**
- **English**: E, T, A, O, I are most common
- **Kinyarwanda**: A, I, U, E, N are most common (more vowels!)
- **French**: E, A, S, I, T are most common

**The chi-squared test:**
This is a statistical method that measures how different two patterns are. A lower score means a better match. We convert this to a 0-1 confidence score where higher is better.

### Step 3: Word Matching (The Dictionary Check)

Frequency analysis alone isn't perfect. Sometimes gibberish can have letter patterns that look somewhat normal. That's why we also check if the decrypted text contains actual words.

**What happens:**
- The system breaks the text into words
- Checks each word against a dictionary of 500+ common words for each language
- Gives full credit for exact matches (like "hello")
- Gives partial credit for words that contain common words (like "hello" in "helloing")

**Why this is powerful:**
- Real language contains real words—gibberish doesn't
- This is the most reliable indicator (50% of the final score)
- Even if only a few words match, it's a strong signal

### Step 4: Readability Patterns (The Sanity Check)

Natural language follows certain rules. Words need vowels. Too many consonants in a row usually means something's wrong.

**What we check:**
- Does each word have at least one vowel (a, e, i, o, u)?
- Are there excessive consonant clusters (like "qwxzk")?
- Is the consonant-to-vowel ratio reasonable?

**Example:**
- "hello world" ✓ (readable)
- "qwxzk mprst" ✗ (too many consonants, no vowels)

### Step 5: Putting It All Together (Composite Scoring)

Each decryption gets a final confidence score from 0 to 1 (0% to 100%) based on:

- **40% Frequency Analysis** - Does the letter pattern match the language?
- **50% Word Matching** - Does it contain real words?
- **10% Readability** - Does it look like natural language?

**Language-specific adjustments:**
- Kinyarwanda has more vowels (about 50%), so we check for that
- English has fewer vowels (about 38%)
- This helps distinguish between languages

### Step 6: Automatic Language Detection

If you select "Auto" for language, the system is even smarter:

1. Scores each of the 26 decryptions against ALL supported languages
2. Finds the best score for English, the best for Kinyarwanda, and the best for French
3. Whichever language has the highest best score wins
4. Returns results ranked using that language's parameters

This means you don't need to know what language the original message was in!

### Step 7: Ranking and Results

Finally, all 26 possible decryptions are sorted by their confidence scores. The one with the highest score appears first—that's almost certainly your plaintext.

**What you see:**
- Shift value (the key that was used)
- Decrypted text
- Confidence score (how sure we are)
- Detected language

### Implementation Files

The algorithm is split across several files in the backend:

**Services Folder** (`server/services/`):
- **`shiftCipher.js`** - Handles the actual decryption math. Contains the decrypt function that shifts letters and the bruteForce function that generates all 26 possibilities.
- **`frequencyAnalysis.js`** - The brain of the operation. Contains all the statistical analysis: frequency tables for each language, chi-squared calculations, word matching logic, readability checks, and the composite scoring system.

**Controllers Folder** (`server/controllers/`):
- **`bruteController.js`** - Acts as the coordinator. Receives requests from the frontend, validates the input using Zod schemas, calls the cipher and analysis services, and formats the response with all the statistics and metadata.

**Routes Folder** (`server/routes/`):
- **`bruteRoutes.js`** - Defines the API endpoints (like `/api/brute` for analysis) and connects them to the controller functions.

### Why This Works

**Historical context:**
The frequency analysis technique was invented by Al-Kindi, a 9th-century Arab mathematician. He discovered that you can break substitution ciphers by analyzing letter patterns. This method has been used for over 1,000 years!

**Modern improvements:**
We've enhanced the classical approach by:
- Adding word matching (Al-Kindi didn't have dictionaries)
- Supporting multiple languages
- Using statistical tests (chi-squared)
- Combining multiple signals for higher accuracy

### Performance and Accuracy

**Speed:**
- Analyzing a message takes less than 1 second
- The algorithm is efficient: O(26n) where n is the text length
- Even long messages (1000+ characters) are instant

**Accuracy:**
- Short messages (< 20 characters): Moderate accuracy
- Medium messages (50-100 characters): High accuracy
- Long messages (100+ characters): Excellent accuracy
- The longer the text, the more statistical data we have

**Limitations:**
- Requires at least some letters (numbers and symbols alone won't work)
- Works best with natural language (not random text)
- Misspellings reduce word matching accuracy
- Very short messages might have multiple plausible decryptions

### Educational Value

This project demonstrates several important computer science concepts:

1. **Cryptanalysis** - How to break weak encryption
2. **Statistical Analysis** - Using math to find patterns
3. **Algorithm Design** - Combining multiple approaches for better results
4. **Multi-language Processing** - Handling different language characteristics
5. **API Design** - Building a clean, RESTful backend

### References and Further Reading

- Al-Kindi's original work on frequency analysis (9th century)
- Pearson's chi-squared test (1900) - the statistical foundation
- Shannon's "Communication Theory of Secrecy Systems" (1949)
- Modern frequency data from linguistic research and text corpora

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
