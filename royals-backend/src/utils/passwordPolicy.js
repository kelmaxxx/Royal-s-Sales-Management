/**
 * Strong Password Policy Validator
 * 
 * Requirements:
 * - Minimum 12 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 * - No common passwords
 */

const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 
  '1234567', 'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou',
  'master', 'sunshine', 'ashley', 'bailey', 'shadow', 'superman',
  'password1', 'password123', 'admin', 'welcome', 'login'
];

export const passwordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  
  validate: (password) => {
    const errors = [];
    
    if (!password) {
      return { valid: false, errors: ['Password is required'] };
    }
    
    // Check minimum length
    if (password.length < passwordPolicy.minLength) {
      errors.push(`Password must be at least ${passwordPolicy.minLength} characters long`);
    }
    
    // Check maximum length (prevent DoS)
    if (password.length > 128) {
      errors.push('Password must not exceed 128 characters');
    }
    
    // Check for uppercase
    if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    // Check for lowercase
    if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    // Check for numbers
    if (passwordPolicy.requireNumbers && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    // Check for special characters
    if (passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>_-+=[]\\\/;\'`~)');
    }
    
    // Check for common passwords
    const lowerPassword = password.toLowerCase();
    for (const common of COMMON_PASSWORDS) {
      if (lowerPassword.includes(common)) {
        errors.push('Password is too common. Please choose a stronger password');
        break;
      }
    }
    
    // Check for sequential characters
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password should not contain repeated characters (e.g., aaa, 111)');
    }
    
    // Check for sequential patterns
    if (/(abc|bcd|cde|def|123|234|345|456|567|678|789)/i.test(password)) {
      errors.push('Password should not contain sequential patterns (e.g., abc, 123)');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  // Generate a strong password suggestion
  generateSuggestion: () => {
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercase = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const special = '!@#$%^&*()_+-=[]{}';
    
    let password = '';
    
    // Ensure at least one of each required type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest randomly
    const allChars = uppercase + lowercase + numbers + special;
    for (let i = password.length; i < 16; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
};

export default passwordPolicy;
