const Api = {
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  get: async (url) => {
    try {
      const response = await fetch(`${Api.baseURL}${url}`, {
        method: 'GET',
        credentials: Api.withCredentials ? 'include' : 'same-origin',
        headers: Api.headers,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  post: async (url, body) => {
    try {
      const response = await fetch(`${Api.baseURL}${url}`, {
        method: 'POST',
        credentials: Api.withCredentials ? 'include' : 'same-origin',
        headers: Api.headers,
        body: JSON.stringify(body),
      });
      if (response.status === 204) {
        // Return an empty object or null when logging out (head :no_content)
        return null;
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};

export default Api;
