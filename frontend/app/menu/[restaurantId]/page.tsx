import dynamic from 'next/dynamic';

const MenuExperience = dynamic(() => import('@/components/menu-experience'), {
  ssr: false,
  loading: () => <main className="min-h-screen bg-[#f7f4ee]" />,
});

export default function RestaurantMenuPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  return <MenuExperience restaurantId={params.restaurantId} />;
}
