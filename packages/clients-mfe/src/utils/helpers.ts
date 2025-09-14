/**
 * Helper function to get the correct image URL for federation
 * Handles both standalone and federated contexts
 */
export const getImageUrl = (imageName?: string): string => {
  const baseUrl = window.location.port === '5173' 
    ? 'http://localhost:5175' // When accessed via shell
    : ''; // When accessed directly
  
  const defaultImage = 'logo_teddy.webp';
  const image = imageName || defaultImage;
  
  return `${baseUrl}/${image}`;
};

/**
 * Helper function to get icon URLs for federation
 */
export const getIconUrl = (iconName: string): string => {
  const baseUrl = window.location.port === '5173' 
    ? 'http://localhost:5175' // When accessed via shell
    : ''; // When accessed directly
  
  return `${baseUrl}/${iconName}`;
};

/**
 * Format currency value for Brazilian locale
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Format currency with "R$" prefix
 */
export const formatCurrencyWithSymbol = (value: number): string => {
  return `R$${formatCurrency(value)}`;
};

/**
 * Get user name from localStorage
 */
export const getUserName = (): string => {
  return localStorage.getItem('userName') || 'Usuário';
};

/**
 * Clear user session
 */
export const clearUserSession = (): void => {
  localStorage.clear();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('userName');
};

/**
 * Generate unique ID for components
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function for search and input handling
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Safe JSON parse with fallback
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Brazilian format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

/**
 * Format phone number
 */
export const formatPhone = (phone: string): string => {
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  
  return phone;
};