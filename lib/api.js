// API utility functions for making requests to our backend routes

const API_BASE = '/api';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Authentication API calls
export const authAPI = {
  // Sign up a new user
  signup: async (userData) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Sign in existing user
  signin: async (credentials) => {
    return apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// User profile API calls
export const userAPI = {
  // Get user profile
  getProfile: async (userId, token) => {
    return apiRequest(`/users/profile?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Update user profile
  updateProfile: async (userId, updates, token) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, updates }),
    });
  },
};

// Chat API calls
export const chatAPI = {
  // Get chat messages
  getMessages: async (limit = 50, token) => {
    return apiRequest(`/chat/messages?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Send a new message
  sendMessage: async (messageData, token) => {
    return apiRequest('/chat/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(messageData),
    });
  },

  // Like/unlike a message
  toggleLike: async (messageId, action, userId, token) => {
    return apiRequest('/chat/messages', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ messageId, action, userId }),
    });
  },
};

// Calls API calls
export const callsAPI = {
  // Get call status
  getCall: async (callId, token) => {
    return apiRequest(`/calls?callId=${callId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Get user's active calls
  getActiveCalls: async (userId, token) => {
    return apiRequest(`/calls?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Start a new call
  startCall: async (callData, token) => {
    return apiRequest('/calls', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(callData),
    });
  },

  // Update call status
  updateCall: async (callId, action, data, token) => {
    return apiRequest('/calls', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ callId, action, ...data }),
    });
  },
};

// Dashboard API calls
export const dashboardAPI = {
  // Get user stats
  getStats: async (userId, token) => {
    // This would aggregate data from calls and messages
    return apiRequest(`/dashboard/stats?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Get recent activity
  getRecentActivity: async (userId, token) => {
    return apiRequest(`/dashboard/activity?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  chat: chatAPI,
  calls: callsAPI,
  dashboard: dashboardAPI,
}; 