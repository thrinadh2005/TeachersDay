/**
 * Smart JNTU Roll Number Normalizer & Validator
 * Disambiguates between digit '0' (zero) and letter 'O' (oh).
 * Standard JNTU/GMRIT format: [Year 2D][College 2D][Degree 1D][Type 1L][Branch 2D][Seq 2D/L]
 * Example: 24341A0502, 23341A05A1, 23345A0501
 */

export function normalizeRollNumber(raw) {
  if (!raw) return '';
  let roll = String(raw).trim().toUpperCase().replace(/\s+/g, '');

  // 1. Common replacement in branch code: "AO5" or "Ao5" -> "A05"
  roll = roll.replace(/A[O|o]5/g, 'A05');
  roll = roll.replace(/A[O|o](\d)/g, 'A0$1');

  // 2. If it's a 10-character JNTU roll number, enforce digit positions
  if (roll.length === 10) {
    const chars = roll.split('');
    
    // Pos 0, 1: Admission Year (always digits, e.g. 23, 24, 25)
    if (chars[0] === 'O') chars[0] = '0';
    if (chars[1] === 'O') chars[1] = '0';

    // Pos 2, 3: College Code (always digits, e.g. 34 for GMRIT)
    if (chars[2] === 'O') chars[2] = '0';
    if (chars[3] === 'O') chars[3] = '0';

    // Pos 4: Degree (always 1 for B.Tech Regular, 5 for Lateral Entry)
    if (chars[4] === 'O') chars[4] = '0';

    // Pos 5: Degree letter (usually 'A')

    // Pos 6, 7: Branch Code (always digits, '05' for CSE)
    if (chars[6] === 'O') chars[6] = '0';
    if (chars[7] === 'O') chars[7] = '0';

    // Pos 8, 9: Student Serial
    // If pos 8 is 'O' and followed by a digit (e.g. 'O1' -> '01', 'O9' -> '09')
    if (chars[8] === 'O' && /\d/.test(chars[9])) {
      chars[8] = '0';
    }
    // If pos 8 and 9 are both 'O' (e.g. 'OO' -> '00')
    if (chars[8] === 'O' && chars[9] === 'O') {
      chars[8] = '0';
      chars[9] = '0';
    }
    // If pos 9 is 'O' and preceded by a digit (e.g. '1O' -> '10', '2O' -> '20', '0O' -> '00')
    if (/\d/.test(chars[8]) && chars[9] === 'O') {
      chars[9] = '0';
    }

    roll = chars.join('');
  }

  // Truncate to maximum 10 characters for JNTU roll numbers
  return roll.slice(0, 10);
}

export function isValidJntuRoll(raw) {
  if (!raw) return false;
  const clean = normalizeRollNumber(raw);
  return clean.length === 10 && /^[0-9A-Z]{10}$/.test(clean);
}

export function formatRollWithSlashes(roll) {
  return normalizeRollNumber(roll);
}

