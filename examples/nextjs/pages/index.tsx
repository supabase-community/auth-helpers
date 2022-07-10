import { useUser } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Auth } from '@supabase/ui';

const LoginPage: NextPage = () => {
  const { isLoading, user, error } = useUser();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from('test').select('*').single();
      setData(data);
    }
    if (user) loadData();
  }, [user]);

  if (!user)
    return (
      <>
        {error && <p>{typeof error === 'string' ? error : error.message}</p>}
        {isLoading ? <h1>Loading...</h1> : <h1>Loaded!</h1>}
        <button
          onClick={() => {
            supabaseClient.auth.signIn(
              { provider: 'github' },
              { scopes: 'repo' }
            );
          }}
        >
          GitHub with scopes
        </button>
        <Auth
          // view="update_password"
          supabaseClient={supabaseClient}
          providers={['google', 'github']}
          // scopes={{github: 'repo'}} // TODO: enable scopes in Auth component.
          socialLayout="horizontal"
          socialButtonSize="xlarge"
        />
      </>
    );

  return (
    <>
      <p>
        [<Link href="/profile">withPageAuth</Link>] | [
        <Link href="/protected-page">supabaseServerClient</Link>] |{' '}
        <button
          onClick={() =>
            supabaseClient.auth.update({ data: { test5: 'updated' } })
          }
        >
          Update
        </button>
      </p>
      {isLoading ? <h1>Loading...</h1> : <h1>Loaded!</h1>}
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>client-side data fetching with RLS</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default LoginPage;
