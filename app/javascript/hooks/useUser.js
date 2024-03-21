import useSWR from 'swr';
import Api from '../services/api';

// Adjusted fetcher function for Fetch API
const fetcher = url => Api.get(url).then(data => data);

const fetcherOptions = {
  revalidateOnFocus: true,
  revalidateOnMount: true,
  revalidateIfStale: true,
}

let isLoggingOut = false;

export function useUser() {
  const { data, error, mutate } = useSWR('/auth/user', fetcher, fetcherOptions);

  const logout = async () => {
    if (isLoggingOut) return;
    isLoggingOut = true;
    try {
      await Api.post('/auth/logout');
      isLoggingOut = false;
      mutate(undefined, true); // True to revalidate after mutating
    } catch (error) {
      isLoggingOut = false;
      console.error('Error during logout:', error);
    }
  };

  return {
    user: data?.user,
    isUserLoading: typeof data === 'undefined' && !error,
    isLoggedIn: !!data?.user,
    isLoggingOut,
    isUserError: error,
    logout,
    mutateUser: mutate
  };
}
