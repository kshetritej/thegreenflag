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
import { Search, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockBusinesses = [
  {
    id: 1,
    name: "Coffee Shop A",
    owner: "john@example.com",
    status: "Active",
    createdAt: "2024-03-01"
  },
  {
    id: 2,
    name: "Restaurant B",
    owner: "jane@example.com",
    status: "Active",
    createdAt: "2024-03-05"
  },
  {
    id: 3,
    name: "Gym C",
    owner: "mike@example.com",
    status: "Suspended",
    createdAt: "2024-03-10"
  },
  {
    id: 4,
    name: "Salon D",
    owner: "sarah@example.com",
    status: "Active",
    createdAt: "2024-03-15"
  }
];

export default function BusinessesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Businesses</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search businesses..." className="pl-8" />
          </div>
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
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBusinesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.name}</TableCell>
                  <TableCell>{business.owner}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${business.status === "Active"
                        ? "bg-primary text-primary-foreground"
                        : "bg-destructive text-destructive-foreground"
                      }`}>
                      {business.status}
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
                        <DropdownMenuItem>Edit Business</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          {business.status === "Active" ? "Suspend Business" : "Activate Business"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 