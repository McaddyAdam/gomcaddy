import dynamic from 'next/dynamic';

const AuthExperience = dynamic(() => import('@/components/auth-experience'), {
  ssr: false,
  loading: () => <main className="min-h-screen bg-[#08110f]" />,
});

export default function AuthPage() {
  return <AuthExperience />;
}
