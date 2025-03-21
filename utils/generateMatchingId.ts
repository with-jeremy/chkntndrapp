/**
 * Utility function to generate a unique 4-digit matching ID
 * 
 * The ID is a random numeric string that is easy to remember and share.
 * It excludes ambiguous digits (0 and 1) to prevent confusion.
 * 
 * @returns A 4-digit string ID
 */
export function generateMatchingId(): string {
  // Use only digits 2-9 to avoid confusion with 0 and 1
  const digits = '23456789';
  let result = '';
  
  // Generate a 4-digit ID
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    result += digits[randomIndex];
  }
  
  return result;
}

/**
 * Utility function to validate a matching ID format
 * 
 * @param id The ID to validate
 * @returns boolean indicating if the ID is valid
 */
export function isValidMatchingId(id: string): boolean {
  // Check if the ID is a 4-digit string containing only digits 2-9
  return /^[2-9]{4}$/.test(id);
}
