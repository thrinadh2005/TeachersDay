/**
 * JNTU Roll Number Validation Utility
 * Standard JNTU Roll Number: Exactly 10 alphanumeric characters (e.g., 24341A0502, 23341A05B3, 23345A0501)
 * Structure:
 * - YY: Admission Year (2 digits, e.g., 22, 23, 24, 25, 26)
 * - CC: College Code (2 alphanumeric characters, e.g., 34, 1A, A5)
 * - E: Entry Code (1 digit: 1 = Regular B.Tech, 5 = Lateral Entry)
 * - P: Program Code (1 letter: A = B.Tech)
 * - BB: Branch Code (2 alphanumeric characters, e.g., 05 = CSE, 12 = IT, etc.)
 * - SS: Student Sequence (2 alphanumeric characters, e.g., 01-99, A0-Z9)
 */

export const JNTU_ROLL_LENGTH = 10;

export const cleanJntuRoll = (rawRoll) => {
  return (rawRoll || '')
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
};

export const validateJntuRoll = (rawRoll) => {
  const clean = cleanJntuRoll(rawRoll);

  if (!clean) {
    return {
      isValid: false,
      clean: '',
      length: 0,
      error: 'Please enter your JNTU Roll Number.'
    };
  }

  if (clean.length < JNTU_ROLL_LENGTH) {
    return {
      isValid: false,
      clean,
      length: clean.length,
      error: `JNTU Roll Number must be exactly 10 characters (e.g. 24341A0502) — entered ${clean.length}/10.`
    };
  }

  if (clean.length > JNTU_ROLL_LENGTH) {
    return {
      isValid: false,
      clean: clean.slice(0, JNTU_ROLL_LENGTH),
      length: clean.length,
      error: `JNTU Roll Number cannot exceed 10 characters — entered ${clean.length}.`
    };
  }

  // Exactly 10 alphanumeric characters
  const standardPattern = /^[0-9]{2}[0-9A-Z]{3}[0-9A-Z]{5}$/;
  if (!standardPattern.test(clean)) {
    return {
      isValid: false,
      clean,
      length: clean.length,
      error: 'Invalid JNTU Roll format. Must be 10 alphanumeric characters (e.g. 24341A0502).'
    };
  }

  return {
    isValid: true,
    clean,
    length: JNTU_ROLL_LENGTH,
    error: null
  };
};
