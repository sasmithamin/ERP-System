import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Store, Phone, MapPin } from "lucide-react";
import { mockShops } from "@/data/mockData";

export default function Shops() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shops</h1>
          <p className="text-muted-foreground">Manage retail shop customers</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Shop</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockShops.map(shop => (
                <TableRow key={shop.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{shop.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{shop.ownerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {shop.area}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {shop.phone}
                    </div>
                  </TableCell>
                  <TableCell>Rs. {shop.creditLimit.toLocaleString()}</TableCell>
                  <TableCell>Rs. {shop.currentBalance.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={shop.isActive ? "default" : "secondary"}>
                      {shop.isActive ? "Active" : "Inactive"}
                    </Badge>
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
