/**
 * Shift Cipher Brute Force Engine
 * Implements Caesar cipher decryption with all possible shifts
 */

export class ShiftCipher {
  /**
   * Decrypt text with a specific shift value
   * @param {string} ciphertext - Encrypted text
   * @param {number} shift - Shift value (0-25)
   * @returns {string} Decrypted text
   */
  static decrypt(ciphertext, shift) {
    return ciphertext
      .split('')
      .map(char => {
        if (char.match(/[a-z]/i)) {
          const isUpperCase = char === char.toUpperCase();
          const base = isUpperCase ? 65 : 97;
          const charCode = char.charCodeAt(0) - base;
          const decrypted = (charCode - shift + 26) % 26;
          return String.fromCharCode(decrypted + base);
        }
        return char;
      })
      .join('');
  }

  /**
   * Brute force all possible shifts (0-25)
   * @param {string} ciphertext - Encrypted text
   * @returns {Array} Array of objects with shift and decrypted text
   */
  static bruteForce(ciphertext) {
    const results = [];
    
    for (let shift = 0; shift < 26; shift++) {
      const plaintext = this.decrypt(ciphertext, shift);
      results.push({
        shift,
        text: plaintext
      });
    }
    
    return results;
  }
}
