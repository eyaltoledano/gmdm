import useSWR from 'swr';
import Api from '../services/api'; 

const fetcher = url => Api.get(url).then(res => res.data);

export function useUser() {
  const { data, error, mutate } = useSWR('/auth/user', fetcher);
  console.log('useUser', data, error, mutate)

  const logout = async () => {
    await Api.post('/auth/logout');
    // After logging out, you can call mutate to re-fetch the user data, which should now be null or undefined
    mutate(); // This re-fetches the user data, expecting it to now be unauthorized or null
  };

  return {
    user: data?.user,
    isUserLoading: !error && !data,
    isLoggedIn: data?.user?.isLoggedIn,
    isUserError: error,
    logout,
  };
}
