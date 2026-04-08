import MenuExperience from '@/components/menu-experience';

export default async function RestaurantMenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  return <MenuExperience restaurantId={restaurantId} />;
}
