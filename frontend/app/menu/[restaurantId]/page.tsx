import { MenuExperience } from '@/components/menu-experience';

export default function RestaurantMenuPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  return <MenuExperience restaurantId={params.restaurantId} />;
}
