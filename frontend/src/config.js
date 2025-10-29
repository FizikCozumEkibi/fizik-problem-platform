// API Configuration
export const API_BASE_URL = import.meta.env.PROD 
  ? '/.netlify/functions' // Production: Netlify Functions
  : 'http://localhost:5000/api'; // Development: Local backend

export const IS_PRODUCTION = import.meta.env.PROD;
