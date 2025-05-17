import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/prisma/prismaClient";
import EditBusinessForm from "@/components/pages/edit-business-form";

export default async function EditBusinessPage({ params }: { params: { businessId: string } }) {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  const business = await prisma.business.findUnique({
    where: {
      id: params.businessId,
      // @ts-expect-error email exists
      owner: { email: session?.user?.email }
    }
  });

  if (!business) {
    redirect("/dashboard/businesses");
  }

  return (
    <div className="container mx-auto py-8">
      <EditBusinessForm business={business} />
    </div>
  );
} 