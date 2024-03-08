// csrfInterceptor.js

(function() {
    // Save a reference to the original fetch function
    const originalFetch = window.fetch;
  
    // Override the fetch function
    window.fetch = function(url, options = {}) {
      // Get the CSRF token from the meta tag in your HTML
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  
      // Ensure options.headers exists
      options.headers = options.headers || {};
  
      // Set the CSRF token in the request headers
      options.headers['X-CSRF-Token'] = csrfToken;
  
      // Call the original fetch function with modified options
      return originalFetch(url, options);
    };
  })();
  