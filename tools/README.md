# 🛠️ Training Tools

This folder contains tools for calculating letter frequencies from text corpora to improve language support.

## Available Tools

### 1. Python Frequency Calculator
**File:** `calculate_frequencies.py`

**Requirements:**
- Python 3.6+
- No external dependencies (uses standard library)

**Usage:**
```bash
python calculate_frequencies.py your_corpus.txt
```

### 2. Node.js Frequency Calculator
**File:** `calculate_frequencies.js`

**Requirements:**
- Node.js 12+
- No external dependencies

**Usage:**
```bash
node calculate_frequencies.js your_corpus.txt
```

## Quick Start Guide

### Step 1: Prepare Your Corpus

Create a text file with Kinyarwanda text:

```bash
# Example: kinyarwanda_corpus.txt
Muraho! Amakuru yawe?
Ni meza cyane.
Rwanda ni igihugu cyiza.
Turabashimira cyane.
...
```

**Tips:**
- Larger corpus = more accurate frequencies
- Aim for 100,000+ words
- Include diverse text (news, books, social media)
- Use modern Kinyarwanda spelling

### Step 2: Run the Calculator

**Using Python:**
```bash
python tools/calculate_frequencies.py kinyarwanda_corpus.txt
```

**Using Node.js:**
```bash
node tools/calculate_frequencies.js kinyarwanda_corpus.txt
```

### Step 3: Review Output

The tool will display:
- Corpus statistics (total characters, letters, etc.)
- Frequency table (sorted by frequency)
- JavaScript format (ready to copy)
- JSON format

Example output:
```
============================================================
CORPUS STATISTICS
============================================================
Total characters (including spaces): 1,234,567
Total letters (a-z only): 987,654
Unique letters found: 26
Missing letters: 0

============================================================
LETTER FREQUENCY TABLE (Sorted by Frequency)
============================================================
Letter     Percentage
------------------------------------------------------------
a          13.50%
i          11.20%
u           9.80%
...

============================================================
JAVASCRIPT FORMAT (Copy & Paste)
============================================================
const KINYARWANDA_FREQ = {
  'a': 13.50, 'i': 11.20, 'u': 9.80, 'e': 8.50, 'o': 7.30,
  'n': 8.90, 'r': 7.60, 'k': 6.80, 'b': 6.20, 'g': 5.40,
  ...
};
```

### Step 4: Update the Code

1. Copy the JavaScript format output
2. Open `server/services/frequencyAnalysis.js`
3. Find the `KINYARWANDA_FREQ` constant
4. Replace it with your calculated values
5. Save the file

### Step 5: Test

1. Restart the server:
   ```bash
   cd server
   npm start
   ```

2. Test with Kinyarwanda ciphertext:
   ```bash
   # Encrypt some Kinyarwanda text with shift 3
   # Then decode it using the app
   ```

3. Verify the correct plaintext is ranked #1

## Where to Get Kinyarwanda Text

### Online Sources

1. **Kinyarwanda Wikipedia**
   - URL: https://rw.wikipedia.org/
   - Download: Use Wikipedia dumps or web scraping

2. **News Websites**
   - Igihe.com
   - KT Press
   - The New Times (Kinyarwanda section)

3. **Government Documents**
   - https://www.gov.rw/
   - Official publications

4. **Books & Literature**
   - Digital libraries
   - Project Gutenberg (if available)

### Web Scraping Example

**Python (using requests + BeautifulSoup):**
```python
import requests
from bs4 import BeautifulSoup

url = 'https://rw.wikipedia.org/wiki/Rwanda'
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# Extract text from paragraphs
text = ' '.join([p.get_text() for p in soup.find_all('p')])

# Save to file
with open('corpus.txt', 'w', encoding='utf-8') as f:
    f.write(text)
```

**Node.js (using axios + cheerio):**
```javascript
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeText(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    let text = '';
    $('p').each((i, elem) => {
        text += $(elem).text() + ' ';
    });
    
    fs.writeFileSync('corpus.txt', text, 'utf-8');
}

scrapeText('https://rw.wikipedia.org/wiki/Rwanda');
```

## Best Practices

### Corpus Quality

✅ **Do:**
- Use diverse sources (news, books, social media)
- Include both formal and informal text
- Use recent text (last 10 years)
- Verify text is actually Kinyarwanda
- Remove duplicate content

❌ **Don't:**
- Use only one source
- Include non-Kinyarwanda text
- Use machine-translated text
- Include too much technical jargon

### Corpus Size

| Size | Quality | Use Case |
|------|---------|----------|
| 10,000 words | Poor | Testing only |
| 100,000 words | Fair | Basic analysis |
| 1,000,000 words | Good | Production use |
| 10,000,000+ words | Excellent | Research quality |

### Validation

After calculating frequencies:

1. **Visual Check**: Do the frequencies look reasonable?
   - Vowels (a, e, i, o, u) should be common
   - Common consonants (n, r, k) should be frequent
   - Rare letters (q, x) should be infrequent

2. **Test with Known Ciphers**: Create test cases
   ```
   Plaintext: "Muraho Rwanda"
   Shift: 3
   Ciphertext: "Pxudkr Uzdqgd"
   
   # Should correctly decode back to "Muraho Rwanda"
   ```

3. **Compare with Research**: Check against published frequencies
   - BIZIMUNGU Theogene (2015) paper
   - Other linguistic research

## Troubleshooting

### "No letters found in text"
- Check file encoding (should be UTF-8)
- Verify file contains actual text
- Check for special characters

### "File not found"
- Verify file path is correct
- Use absolute path if needed
- Check file permissions

### Frequencies look wrong
- Corpus might be too small
- Text might not be Kinyarwanda
- Check for duplicate content
- Verify text quality

## Advanced Usage

### Bigram/Trigram Analysis

For even better accuracy, analyze letter pairs and triplets:

```python
from collections import Counter

def calculate_bigrams(text):
    bigrams = [text[i:i+2] for i in range(len(text)-1)]
    return Counter(bigrams)

def calculate_trigrams(text):
    trigrams = [text[i:i+3] for i in range(len(text)-2)]
    return Counter(trigrams)
```

### Word Frequency

Analyze common words:

```python
def calculate_word_frequency(text):
    words = text.lower().split()
    return Counter(words)
```

## Contributing

If you calculate accurate Kinyarwanda frequencies:

1. Document your corpus (size, sources, date)
2. Share your methodology
3. Test accuracy with known ciphers
4. Submit a pull request or issue

## Resources

- [KINYARWANDA_TRAINING.md](../KINYARWANDA_TRAINING.md) - Complete training guide
- [Frequency Analysis Paper](https://ijcttjournal.org/archives/ijctt-v30p126) - Research reference
- [Kinyarwanda Wikipedia](https://rw.wikipedia.org/) - Text source

---

**Questions?** Open an issue or check the main documentation!
