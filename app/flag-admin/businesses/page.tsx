"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

async function getBusinesses(search: string = "", page: number = 1) {
  const response = await fetch(
    `/api/admin/businesses?search=${search}&page=${page}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch businesses");
  }

  const data = await response.json();
  console.log("API Response:", data);
  return data;
}

async function updateBusinessStatus(businessId: string, action: string) {
  const response = await fetch(`/api/admin/businesses/${businessId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    throw new Error("Failed to update business status");
  }

  return response.json();
}

export default function BusinessesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getBusinesses(search, page);
        console.log("Setting data:", result);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [search, page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;
    setSearch(searchValue);
    setPage(1);
    router.push(`/flag-admin/businesses?search=${searchValue}&page=1`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`/flag-admin/businesses?search=${search}&page=${newPage}`);
  };

  const handleStatusUpdate = async (
    businessId: string,
    currentStatus: boolean,
    action: "verify" | "unverify" | "suspend" | "unsuspend"
  ) => {
    try {
      await updateBusinessStatus(businessId, action);
      const actionText = action === "verify" ? "verified" :
        action === "unverify" ? "unverified" :
          action === "suspend" ? "suspended" : "reactivated";
      toast.success(`Business ${actionText} successfully`);
      // Refresh the data
      const result = await getBusinesses(search, page);
      setData(result);
    } catch (error) {
      console.error("Failed to update business status:", error);
      toast.error("Failed to update business status");
    }
  };

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  console.log("Rendering with data:", data);
  const { businesses, pagination } = data;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Businesses</h1>
        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search businesses..."
              className="pl-8"
              defaultValue={search}
            />
          </form>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Suspension</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses.map((business: any) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.name}</TableCell>
                  <TableCell>{business.owner}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${business.status
                        ? "bg-primary text-primary-foreground"
                        : "bg-destructive text-destructive-foreground"
                      }`}>
                      {business.status ? "VERIFIED" : "UNVERIFIED"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${business.suspended
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-primary text-primary-foreground"
                      }`}>
                      {business.suspended ? "SUSPENDED" : "ACTIVE"}
                    </span>
                  </TableCell>
                  <TableCell>{business.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleStatusUpdate(
                            business.id,
                            business.status,
                            business.status ? "unverify" : "verify"
                          )}
                        >
                          {business.status ? "Unverify Business" : "Verify Business"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleStatusUpdate(
                            business.id,
                            business.suspended,
                            business.suspended ? "unsuspend" : "suspend"
                          )}
                        >
                          {business.suspended ? "Reactivate Business" : "Suspend Business"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {businesses.length} of {pagination.total} businesses
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.pages}
                onClick={() => handlePageChange(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 