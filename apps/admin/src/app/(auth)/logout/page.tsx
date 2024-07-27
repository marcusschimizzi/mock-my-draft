'use client';
import { Loading } from '@/components/loading';
import { useUser } from '@/lib/get-user';
import { useLogout } from '@/lib/logout';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Logout() {
  const user = useUser();
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
    logout.submit();
    router.push('/');
  }, [logout, router, user]);

  return <Loading />;
}

export default Logout;
