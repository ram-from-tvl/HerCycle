const API_BASE = 'http://localhost:8000';

export interface UserProfile {
  age: number;
  height_cm?: number;  // Fixed: matches backend
  weight_kg?: number;  // Fixed: matches backend
  diet_type: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian';  // Fixed: non_veg -> non_vegetarian
  food_constraints: string[];
  budget_level: 'low' | 'medium' | 'high';
  food_access: 'cook' | 'mess' | 'delivery' | 'mixed';
  region?: string;  // Added: backend has this field
  movement_space: 'room' | 'home' | 'gym' | 'outdoors';  // Fixed: outdoor -> outdoors
  activity_background: 'beginner' | 'intermediate' | 'advanced';  // Fixed: fitness_level -> activity_background
  time_availability: '5-10min' | '15-20min' | '30min+';  // Fixed: matches backend format
  emotional_comfort_level: 'low' | 'medium' | 'high';
  preferred_product: 'pads' | 'tampons' | 'menstrual_cup' | 'cloth' | 'period_underwear';  // Fixed: cup -> menstrual_cup
  location_lat?: number;  // Fixed: matches backend
  location_lng?: number;  // Fixed: matches backend
  allow_location?: boolean;  // Added: backend has this field
}

export interface CheckInData {
  pain: number;        // Fixed: pain_level -> pain
  energy: number;      // Fixed: energy_level -> energy
  stress: number;      // Fixed: stress_level -> stress
  mood: string;
  sleep_hours: number;
  symptoms: string[];
  notes?: string;
}

export interface CycleLog {
  start_date: string;
  period_length: number;
  flow_intensity: 'light' | 'medium' | 'heavy';
  notes?: string;
}

export const api = {
  // Health check
  health: async () => {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  },

  // Profile endpoints
  getProfile: async () => {
    const response = await fetch(`${API_BASE}/profile/`);
    return response.json();
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const response = await fetch(`${API_BASE}/profile/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateLocation: async (latitude: number, longitude: number, allow_location: boolean = true) => {
    const response = await fetch(`${API_BASE}/profile/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        lat: latitude,    // Fixed: backend expects lat/lng
        lng: longitude,   // Fixed: backend expects lat/lng
        allow_location 
      }),
    });
    return response.json();
  },

  resetProfile: async () => {
    const response = await fetch(`${API_BASE}/profile/reset`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  // Cycle tracking
  setCycleTracking: async (data: any) => {
    const response = await fetch(`${API_BASE}/cycles/set-current`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Daily check-in
  submitCheckin: async (data: CheckInData) => {
    const response = await fetch(`${API_BASE}/checkin/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Daily AI Plan
  generatePlan: async () => {
    const response = await fetch(`${API_BASE}/plan/today`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    return response.json();
  },

  getLatestPlan: async () => {
    const response = await fetch(`${API_BASE}/plan/latest`);
    return response.json();
  },

  // Cycle tracking
  logCycle: async (data: CycleLog) => {
    const response = await fetch(`${API_BASE}/cycles/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getCycleHistory: async () => {
    const response = await fetch(`${API_BASE}/cycles/`);
    return response.json();
  },

  getCyclePatterns: async () => {
    const response = await fetch(`${API_BASE}/cycles/current`);
    return response.json();
  },

  // Check-in
  submitCheckIn: async (data: CheckInData) => {
    const response = await fetch(`${API_BASE}/checkin/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getCheckInHistory: async (days: number = 7) => {
    const response = await fetch(`${API_BASE}/checkin/history?days=${days}`);
    return response.json();
  },

  // Support resources
  getResources: async (topic?: string) => {
    const url = topic 
      ? `${API_BASE}/support/resources?topic=${topic}`
      : `${API_BASE}/support/resources`;
    const response = await fetch(url);
    return response.json();
  },

  // Nearby support
  findNearby: async (type: 'products' | 'clinic', radius: number = 5000) => {
    const response = await fetch(`${API_BASE}/support/nearby`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, radius }),
    });
    return response.json();
  },
};
