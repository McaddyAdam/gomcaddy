import dynamic from 'next/dynamic';

const HomeExperience = dynamic(() => import('@/components/home-experience'), {
  ssr: false,
  loading: () => <main className="min-h-screen bg-slate-950" />,
});

export default function Home() {
  return <HomeExperience />;
}
