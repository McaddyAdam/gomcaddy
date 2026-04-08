import { Suspense } from 'react';
import AuthExperience from '@/components/auth-experience';

export default function AuthPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#08110f]" />}>
      <AuthExperience />
    </Suspense>
  );
}
