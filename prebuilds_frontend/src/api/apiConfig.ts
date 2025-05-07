const Production_URL = "https://api.prebuilds.shop";

const Development_URL = "http://localhost:8000";

export const BASE_API_URL: string = window.location.hostname === "localhost" ? Development_URL : Production_URL;

// Making a simple variable that detects if we're in development mode or production mode, without having to manually 
// change the base URL before each push on main branch