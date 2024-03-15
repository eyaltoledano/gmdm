import useSWR from 'swr';
import Api from '../services/api'; 

const fetcher = url => Api.get(url).then(res => res.data);

export function useUser() {
  const { data, error, mutate } = useSWR('/auth/user', fetcher);

  const logout = async () => {
    try {
      // Attempt to logout
      const response = await Api.post('/auth/logout');
      // Check for successful logout response (e.g., status 204)
      if (response.status === 204) {
        // Use mutate to update SWR cache, setting the user data to undefined
        mutate(undefined, false); // The second argument false means do not revalidate
      } else {
        console.error('Logout failed:', response);
        // Handle failed logout if necessary
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle error (e.g., network error, server error)
    }
  };

  return {
    user: data?.user,
    isUserLoading: !error && !data,
    isLoggedIn: data?.user?.isLoggedIn,
    isUserError: error,
    logout,
  };
}
