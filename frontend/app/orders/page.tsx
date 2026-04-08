import dynamic from 'next/dynamic';

const OrdersExperience = dynamic(() => import('@/components/orders-experience'), {
  ssr: false,
  loading: () => <main className="min-h-screen bg-[#f7f4ee]" />,
});

export default function OrdersPage() {
  return <OrdersExperience />;
}
