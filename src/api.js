import { BASE_URL } from './config';



export const apiCall = async (endpoint, options = {}) => {
  const schoolId = localStorage.getItem('school_id');
    options.headers = {
      'Content-Type': 'application/json',
      'X-School-Id': schoolId || '', // Include school ID in headers if available
      ...options.headers,
    };


  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    // Try to get error message from response
    let errorMessage = `API Error: ${response.status}`;
    try {
      const errorData = await response.text();
      if (errorData) {
        errorMessage = errorData;
      }
    } catch (e) {
      // Ignore if can't parse error response
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text();
  }
};

export const apiGet = (endpoint) => apiCall(endpoint, { method: 'GET' });

export const apiPost = (endpoint, data) =>
  apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiPut = (endpoint, data) =>
  apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const apiDelete = (endpoint) =>
  apiCall(endpoint, { method: 'DELETE' });
