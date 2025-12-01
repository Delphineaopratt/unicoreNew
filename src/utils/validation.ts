// Validation utility functions

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Phone validation
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number (at least 10 digits)' };
  }
  
  return { isValid: true };
};

// CGPA validation
export const validateCGPA = (cgpa: string): ValidationResult => {
  if (!cgpa || cgpa.trim() === '') {
    return { isValid: false, error: 'CGPA is required' };
  }
  
  const cgpaNum = parseFloat(cgpa);
  if (isNaN(cgpaNum)) {
    return { isValid: false, error: 'CGPA must be a number' };
  }
  
  if (cgpaNum < 0 || cgpaNum > 4.0) {
    return { isValid: false, error: 'CGPA must be between 0.0 and 4.0' };
  }
  
  return { isValid: true };
};

// File validation
export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  required?: boolean;
}

export const validateFile = (
  file: File | null,
  options: FileValidationOptions = {}
): ValidationResult => {
  const {
    maxSizeMB = 5,
    allowedTypes = ['.pdf', '.doc', '.docx'],
    required = true,
  } = options;

  if (!file) {
    if (required) {
      return { isValid: false, error: 'File is required' };
    }
    return { isValid: true };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  // Check file type
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`,
    };
  }

  return { isValid: true };
};

// Text length validation
export const validateTextLength = (
  text: string,
  minLength: number = 0,
  maxLength: number = Infinity,
  fieldName: string = 'Field'
): ValidationResult => {
  const trimmedText = text?.trim() || '';
  
  if (minLength > 0 && trimmedText.length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (trimmedText.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  
  if (trimmedText.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${maxLength} characters`,
    };
  }
  
  return { isValid: true };
};

// Address validation
export const validateAddress = (address: string): ValidationResult => {
  return validateTextLength(address, 10, 500, 'Address');
};

// Cover letter validation
export const validateCoverLetter = (coverLetter: string): ValidationResult => {
  const result = validateTextLength(coverLetter, 100, 2000, 'Cover letter');
  if (!result.isValid) {
    if (coverLetter.trim().length < 100) {
      return {
        isValid: false,
        error: 'Cover letter should be at least 100 characters (recommended 300-500 words)',
      };
    }
  }
  return result;
};

// Program validation
export const validateProgram = (program: string): ValidationResult => {
  return validateTextLength(program, 2, 100, 'Program');
};

// Date validation
export const validateDate = (date: string | Date, fieldName: string = 'Date'): ValidationResult => {
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` };
  }
  
  return { isValid: true };
};

// Future date validation
export const validateFutureDate = (
  date: string | Date,
  fieldName: string = 'Date'
): ValidationResult => {
  const dateValidation = validateDate(date, fieldName);
  if (!dateValidation.isValid) {
    return dateValidation;
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj < today) {
    return {
      isValid: false,
      error: `${fieldName} must be today or in the future`,
    };
  }
  
  return { isValid: true };
};

// Date range validation
export const validateDateRange = (
  startDate: string | Date,
  endDate: string | Date
): ValidationResult => {
  const startValidation = validateDate(startDate, 'Start date');
  if (!startValidation.isValid) {
    return startValidation;
  }
  
  const endValidation = validateDate(endDate, 'End date');
  if (!endValidation.isValid) {
    return endValidation;
  }
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (end <= start) {
    return {
      isValid: false,
      error: 'End date must be after start date',
    };
  }
  
  return { isValid: true };
};

// Array validation (for selections)
export const validateSelection = (
  items: any[],
  minItems: number = 1,
  fieldName: string = 'Selection'
): ValidationResult => {
  if (!items || items.length < minItems) {
    return {
      isValid: false,
      error: `Please select at least ${minItems} ${fieldName.toLowerCase()}${minItems > 1 ? 's' : ''}`,
    };
  }
  
  return { isValid: true };
};

// Terms acceptance validation
export const validateTermsAcceptance = (accepted: boolean): ValidationResult => {
  if (!accepted) {
    return {
      isValid: false,
      error: 'You must accept the terms and conditions to proceed',
    };
  }
  
  return { isValid: true };
};
