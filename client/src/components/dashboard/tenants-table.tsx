import { Tenant } from "@shared/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TenantsTableProps {
  tenants: Tenant[];
}

export default function TenantsTable({ tenants }: TenantsTableProps) {
  // Sort tenants by data usage (descending)
  const sortedTenants = [...tenants].sort((a, b) => b.dataUsage - a.dataUsage);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="w-16 text-muted-foreground">No.</TableHead>
            <TableHead className="text-muted-foreground">Name</TableHead>
            <TableHead className="text-muted-foreground">Data Usage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTenants.length > 0 ? (
            sortedTenants.map((tenant, index) => (
              <TableRow key={tenant.id} className="hover:bg-background/50 transition-colors">
                <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>
                  {(tenant.dataUsage / (1024 * 1024 * 1024)).toFixed(1)} GB
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                No tenants found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
