#!/usr/bin/env python3
"""
Kinyarwanda Letter Frequency Calculator
========================================

This script calculates letter frequencies from a Kinyarwanda text corpus.

Usage:
    python calculate_frequencies.py input.txt

Output:
    - Frequency table (sorted by frequency)
    - JavaScript object format (ready to paste into code)
    - Statistics about the corpus
"""

import re
import sys
from collections import Counter
from pathlib import Path


def clean_text(text):
    """
    Clean text by removing non-letter characters and converting to lowercase.
    """
    # Convert to lowercase
    text = text.lower()
    
    # Keep only letters a-z
    text = re.sub(r'[^a-z]', '', text)
    
    return text


def calculate_frequencies(text):
    """
    Calculate letter frequencies as percentages.
    """
    # Count letter occurrences
    letter_counts = Counter(text)
    
    # Calculate total letters
    total = sum(letter_counts.values())
    
    if total == 0:
        print("Error: No letters found in text!")
        return {}
    
    # Calculate percentages
    frequencies = {}
    for letter, count in letter_counts.items():
        frequencies[letter] = (count / total) * 100
    
    return frequencies


def print_statistics(text, frequencies):
    """
    Print corpus statistics.
    """
    print("\n" + "="*60)
    print("CORPUS STATISTICS")
    print("="*60)
    print(f"Total characters (including spaces): {len(text):,}")
    print(f"Total letters (a-z only): {len(clean_text(text)):,}")
    print(f"Unique letters found: {len(frequencies)}")
    print(f"Missing letters: {26 - len(frequencies)}")
    
    if len(frequencies) < 26:
        all_letters = set('abcdefghijklmnopqrstuvwxyz')
        found_letters = set(frequencies.keys())
        missing = all_letters - found_letters
        print(f"Missing: {', '.join(sorted(missing))}")


def print_frequency_table(frequencies):
    """
    Print frequency table sorted by frequency.
    """
    print("\n" + "="*60)
    print("LETTER FREQUENCY TABLE (Sorted by Frequency)")
    print("="*60)
    print(f"{'Letter':<10} {'Count':<15} {'Percentage':<15}")
    print("-"*60)
    
    # Sort by frequency (descending)
    sorted_freq = sorted(frequencies.items(), key=lambda x: x[1], reverse=True)
    
    for letter, percentage in sorted_freq:
        print(f"{letter:<10} {percentage:>10.2f}%")


def print_javascript_format(frequencies):
    """
    Print frequencies in JavaScript object format.
    """
    print("\n" + "="*60)
    print("JAVASCRIPT FORMAT (Copy & Paste)")
    print("="*60)
    print("const KINYARWANDA_FREQ = {")
    
    # Sort by frequency (descending)
    sorted_freq = sorted(frequencies.items(), key=lambda x: x[1], reverse=True)
    
    # Print in rows of 5 for readability
    items = [f"  '{letter}': {percentage:.2f}" for letter, percentage in sorted_freq]
    
    for i in range(0, len(items), 5):
        row = items[i:i+5]
        print(", ".join(row) + ("," if i + 5 < len(items) else ""))
    
    print("};")


def print_json_format(frequencies):
    """
    Print frequencies in JSON format.
    """
    import json
    
    print("\n" + "="*60)
    print("JSON FORMAT")
    print("="*60)
    
    # Sort by frequency (descending)
    sorted_freq = dict(sorted(frequencies.items(), key=lambda x: x[1], reverse=True))
    
    # Round to 2 decimal places
    rounded = {k: round(v, 2) for k, v in sorted_freq.items()}
    
    print(json.dumps(rounded, indent=2))


def main():
    """
    Main function.
    """
    # Check command line arguments
    if len(sys.argv) < 2:
        print("Usage: python calculate_frequencies.py <input_file.txt>")
        print("\nExample:")
        print("  python calculate_frequencies.py kinyarwanda_corpus.txt")
        sys.exit(1)
    
    # Read input file
    input_file = Path(sys.argv[1])
    
    if not input_file.exists():
        print(f"Error: File '{input_file}' not found!")
        sys.exit(1)
    
    print(f"Reading file: {input_file}")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            text = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)
    
    # Clean text
    cleaned_text = clean_text(text)
    
    if not cleaned_text:
        print("Error: No valid text found in file!")
        sys.exit(1)
    
    # Calculate frequencies
    frequencies = calculate_frequencies(cleaned_text)
    
    # Print results
    print_statistics(text, frequencies)
    print_frequency_table(frequencies)
    print_javascript_format(frequencies)
    print_json_format(frequencies)
    
    # Save to output file
    output_file = input_file.stem + '_frequencies.txt'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("LETTER FREQUENCIES\n")
        f.write("="*60 + "\n\n")
        
        sorted_freq = sorted(frequencies.items(), key=lambda x: x[1], reverse=True)
        for letter, percentage in sorted_freq:
            f.write(f"{letter}: {percentage:.2f}%\n")
    
    print(f"\n✅ Results saved to: {output_file}")
    print("\n" + "="*60)
    print("NEXT STEPS:")
    print("="*60)
    print("1. Copy the JavaScript format above")
    print("2. Open: server/services/frequencyAnalysis.js")
    print("3. Replace the KINYARWANDA_FREQ object")
    print("4. Restart the server")
    print("5. Test with Kinyarwanda ciphertext!")


if __name__ == '__main__':
    main()
