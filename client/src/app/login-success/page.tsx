import { Suspense } from 'react';
import LoginSuccessClient from '@/app/login-success/LoginSucessClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <LoginSuccessClient />
    </Suspense>
  );
}
