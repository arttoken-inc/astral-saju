import PaidResultPage from "@/components/saju/PaidResultPage";

export default async function PaidResultRoute({
  params,
  searchParams,
}: {
  params: Promise<{ serviceId: string; orderId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { serviceId, orderId } = await params;
  const { page } = await searchParams;
  const initialPage = Math.max(0, parseInt(page || "0", 10));

  return (
    <PaidResultPage
      serviceId={serviceId}
      orderId={orderId}
      initialPage={initialPage}
    />
  );
}
