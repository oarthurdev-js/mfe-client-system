// Pagination constants
export const ITEMS_PER_PAGE_OPTIONS = [8, 16, 24, 32] as const;
export const DEFAULT_ITEMS_PER_PAGE = 16;
export const DEFAULT_PAGE = 1;

// Local storage keys
export const STORAGE_KEYS = {
  USER_NAME: 'userName',
  SELECTED_CLIENTS: 'selectedClients',
  PREFERENCES: 'userPreferences'
} as const;

// Modal modes
export const MODAL_MODES = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete'
} as const;

// Sidebar items
export const SIDEBAR_ITEMS = {
  HOME: 'home',
  CLIENTS: 'clients',
  SELECTED_CLIENTS: 'selected-clients',
  LOGOUT: 'logout'
} as const;

// View types
export const VIEW_TYPES = {
  CLIENTS: 'clients',
  SELECTED: 'selected'
} as const;

// API endpoints
export const API_ENDPOINTS = {
  CLIENTS: '/api/users',
  LOGIN: '/api/auth/login'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Por favor, insira um email válido',
  INVALID_PHONE: 'Por favor, insira um telefone válido',
  POSITIVE_NUMBER: 'Este valor deve ser um número positivo',
  GENERIC_ERROR: 'Ocorreu um erro inesperado. Tente novamente.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Você não tem permissão para realizar esta ação.',
  NOT_FOUND: 'Recurso não encontrado.'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CLIENT_CREATED: 'Cliente criado com sucesso!',
  CLIENT_UPDATED: 'Cliente atualizado com sucesso!',
  CLIENT_DELETED: 'Cliente deletado com sucesso!',
  CLIENT_ADDED_TO_SELECTION: 'Cliente adicionado à seleção!'
} as const;

// Form validation rules
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  SALARY: {
    MIN_VALUE: 0,
    MAX_VALUE: 999999999
  },
  COMPANY_VALUATION: {
    MIN_VALUE: 0,
    MAX_VALUE: 999999999999
  }
} as const;

// Debounce delays (in milliseconds)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  FORM_VALIDATION: 500,
  API_CALLS: 1000
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1200
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const;

// Icons used in the application
export const ICONS = {
  MENU: 'menu-hamburguer.png',
  PLUS: 'plus.png',
  EDIT: 'pencil.png',
  DELETE: 'trash.png',
  CLOSE: 'close.png',
  SEARCH: 'search.png'
} as const;

// Theme colors (can be moved to CSS custom properties)
export const COLORS = {
  PRIMARY: '#ff6b35',
  SECONDARY: '#4a90e2',
  SUCCESS: '#28a745',
  ERROR: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8'
} as const;