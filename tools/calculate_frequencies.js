#!/usr/bin/env node
/**
 * Kinyarwanda Letter Frequency Calculator (Node.js)
 * ==================================================
 * 
 * This script calculates letter frequencies from a Kinyarwanda text corpus.
 * 
 * Usage:
 *   node calculate_frequencies.js input.txt
 * 
 * Output:
 *   - Frequency table (sorted by frequency)
 *   - JavaScript object format (ready to paste into code)
 *   - Statistics about the corpus
 */

const fs = require('fs');
const path = require('path');

/**
 * Clean text by removing non-letter characters
 */
function cleanText(text) {
    return text.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Calculate letter frequencies as percentages
 */
function calculateFrequencies(text) {
    const letterCounts = {};
    
    // Count occurrences
    for (const letter of text) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
    
    // Calculate total
    const total = Object.values(letterCounts).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
        console.error('Error: No letters found in text!');
        return {};
    }
    
    // Calculate percentages
    const frequencies = {};
    for (const [letter, count] of Object.entries(letterCounts)) {
        frequencies[letter] = (count / total) * 100;
    }
    
    return frequencies;
}

/**
 * Print corpus statistics
 */
function printStatistics(originalText, cleanedText, frequencies) {
    console.log('\n' + '='.repeat(60));
    console.log('CORPUS STATISTICS');
    console.log('='.repeat(60));
    console.log(`Total characters (including spaces): ${originalText.length.toLocaleString()}`);
    console.log(`Total letters (a-z only): ${cleanedText.length.toLocaleString()}`);
    console.log(`Unique letters found: ${Object.keys(frequencies).length}`);
    console.log(`Missing letters: ${26 - Object.keys(frequencies).length}`);
    
    if (Object.keys(frequencies).length < 26) {
        const allLetters = new Set('abcdefghijklmnopqrstuvwxyz'.split(''));
        const foundLetters = new Set(Object.keys(frequencies));
        const missing = [...allLetters].filter(l => !foundLetters.has(l));
        console.log(`Missing: ${missing.join(', ')}`);
    }
}

/**
 * Print frequency table sorted by frequency
 */
function printFrequencyTable(frequencies) {
    console.log('\n' + '='.repeat(60));
    console.log('LETTER FREQUENCY TABLE (Sorted by Frequency)');
    console.log('='.repeat(60));
    console.log('Letter'.padEnd(10) + 'Percentage'.padStart(15));
    console.log('-'.repeat(60));
    
    // Sort by frequency (descending)
    const sorted = Object.entries(frequencies)
        .sort((a, b) => b[1] - a[1]);
    
    for (const [letter, percentage] of sorted) {
        console.log(letter.padEnd(10) + `${percentage.toFixed(2)}%`.padStart(15));
    }
}

/**
 * Print frequencies in JavaScript object format
 */
function printJavaScriptFormat(frequencies) {
    console.log('\n' + '='.repeat(60));
    console.log('JAVASCRIPT FORMAT (Copy & Paste)');
    console.log('='.repeat(60));
    console.log('const KINYARWANDA_FREQ = {');
    
    // Sort by frequency (descending)
    const sorted = Object.entries(frequencies)
        .sort((a, b) => b[1] - a[1]);
    
    // Print in rows of 5 for readability
    const items = sorted.map(([letter, percentage]) => 
        `  '${letter}': ${percentage.toFixed(2)}`
    );
    
    for (let i = 0; i < items.length; i += 5) {
        const row = items.slice(i, i + 5);
        const comma = i + 5 < items.length ? ',' : '';
        console.log(row.join(', ') + comma);
    }
    
    console.log('};');
}

/**
 * Print frequencies in JSON format
 */
function printJSONFormat(frequencies) {
    console.log('\n' + '='.repeat(60));
    console.log('JSON FORMAT');
    console.log('='.repeat(60));
    
    // Sort by frequency (descending)
    const sorted = Object.entries(frequencies)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [key, val]) => {
            obj[key] = parseFloat(val.toFixed(2));
            return obj;
        }, {});
    
    console.log(JSON.stringify(sorted, null, 2));
}

/**
 * Main function
 */
function main() {
    // Check command line arguments
    if (process.argv.length < 3) {
        console.log('Usage: node calculate_frequencies.js <input_file.txt>');
        console.log('\nExample:');
        console.log('  node calculate_frequencies.js kinyarwanda_corpus.txt');
        process.exit(1);
    }
    
    const inputFile = process.argv[2];
    
    // Check if file exists
    if (!fs.existsSync(inputFile)) {
        console.error(`Error: File '${inputFile}' not found!`);
        process.exit(1);
    }
    
    console.log(`Reading file: ${inputFile}`);
    
    // Read file
    let text;
    try {
        text = fs.readFileSync(inputFile, 'utf-8');
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        process.exit(1);
    }
    
    // Clean text
    const cleanedText = cleanText(text);
    
    if (!cleanedText) {
        console.error('Error: No valid text found in file!');
        process.exit(1);
    }
    
    // Calculate frequencies
    const frequencies = calculateFrequencies(cleanedText);
    
    // Print results
    printStatistics(text, cleanedText, frequencies);
    printFrequencyTable(frequencies);
    printJavaScriptFormat(frequencies);
    printJSONFormat(frequencies);
    
    // Save to output file
    const outputFile = path.basename(inputFile, path.extname(inputFile)) + '_frequencies.txt';
    
    let output = 'LETTER FREQUENCIES\n';
    output += '='.repeat(60) + '\n\n';
    
    const sorted = Object.entries(frequencies)
        .sort((a, b) => b[1] - a[1]);
    
    for (const [letter, percentage] of sorted) {
        output += `${letter}: ${percentage.toFixed(2)}%\n`;
    }
    
    fs.writeFileSync(outputFile, output, 'utf-8');
    
    console.log(`\n✅ Results saved to: ${outputFile}`);
    console.log('\n' + '='.repeat(60));
    console.log('NEXT STEPS:');
    console.log('='.repeat(60));
    console.log('1. Copy the JavaScript format above');
    console.log('2. Open: server/services/frequencyAnalysis.js');
    console.log('3. Replace the KINYARWANDA_FREQ object');
    console.log('4. Restart the server');
    console.log('5. Test with Kinyarwanda ciphertext!');
}

// Run main function
main();
