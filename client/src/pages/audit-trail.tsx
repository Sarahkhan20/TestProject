import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { AuditTrail } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Filter } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AuditTrailPage() {
  useEffect(() => {
    document.title = "futureKonnect | Audit Trail";
  }, []);

  const [filters, setFilters] = useState({
    category: "",
    event: "",
    performedBy: "",
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: auditTrails, isLoading } = useQuery<AuditTrail[]>({
    queryKey: ["/api/audit-trails"],
  });

  const filterMutation = useMutation({
    mutationFn: async (filterData: typeof filters) => {
      const res = await apiRequest("POST", "/api/audit-trails/filter", filterData);
      return await res.json();
    },
    onSuccess: (filteredData) => {
      queryClient.setQueryData(["/api/audit-trails"], filteredData);
      setCurrentPage(1);
    },
  });

  const handleFilterSubmit = () => {
    // Only include non-empty filter values
    const nonEmptyFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => (value ? { ...acc, [key]: value } : acc),
      {}
    );
    
    filterMutation.mutate(nonEmptyFilters as typeof filters);
  };

  const handleDownloadLogs = () => {
    // In a real application, this would trigger a download
    // For now, let's just show what would happen
    console.log("Downloading logs...");
  };

  // Calculate pagination
  const totalItems = auditTrails?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = auditTrails?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get event color
  const getEventColor = (event: string) => {
    switch (event.toLowerCase()) {
      case "create":
        return "bg-green-600";
      case "delete":
        return "bg-red-600";
      case "update":
        return "bg-blue-600";
      case "download":
        return "bg-amber-600";
      case "login":
        return "bg-indigo-600";
      case "logout":
        return "bg-slate-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Audit Trail</h2>
          <Button 
            variant="outline"
            onClick={handleDownloadLogs}
            className="bg-background-card hover:bg-background-card/80"
          >
            <Download className="mr-2 h-4 w-4" />
            Download log
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Filters */}
          <div className="col-span-1 space-y-6">
            {/* Category Filter */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger className="w-full bg-background-card border-background-lighter">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Firewall Rule">Firewall Rule</SelectItem>
                  <SelectItem value="Router Certificate">Router Certificate</SelectItem>
                  <SelectItem value="Hotspot User">Hotspot User</SelectItem>
                  <SelectItem value="Firewall Template">Firewall Template</SelectItem>
                  <SelectItem value="Router">Router</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Tenant">Tenant</SelectItem>
                  <SelectItem value="Fleet">Fleet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Action Filter */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2">Action</Label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="create-action" 
                    checked={filters.event === "Create"}
                    onCheckedChange={(checked) => 
                      setFilters({ ...filters, event: checked ? "Create" : "" })
                    }
                  />
                  <label htmlFor="create-action" className="ml-2 text-sm">Create</label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="delete-action"
                    checked={filters.event === "Delete"}
                    onCheckedChange={(checked) => 
                      setFilters({ ...filters, event: checked ? "Delete" : "" })
                    }
                  />
                  <label htmlFor="delete-action" className="ml-2 text-sm">Delete</label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="update-action"
                    checked={filters.event === "Update"}
                    onCheckedChange={(checked) => 
                      setFilters({ ...filters, event: checked ? "Update" : "" })
                    }
                  />
                  <label htmlFor="update-action" className="ml-2 text-sm">Update</label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="download-action"
                    checked={filters.event === "Download"}
                    onCheckedChange={(checked) => 
                      setFilters({ ...filters, event: checked ? "Download" : "" })
                    }
                  />
                  <label htmlFor="download-action" className="ml-2 text-sm">Download</label>
                </div>
              </div>
            </div>
            
            {/* User Filter */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2">User</Label>
              <Input 
                type="text" 
                placeholder="Search user" 
                className="w-full bg-background-card border-background-lighter"
                value={filters.performedBy}
                onChange={(e) => setFilters({ ...filters, performedBy: e.target.value })}
              />
            </div>
            
            {/* Date Filter */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2">Date</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground block mb-1">Start date</Label>
                  <Input 
                    type="date" 
                    className="w-full bg-background-card border-background-lighter"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground block mb-1">End date</Label>
                  <Input 
                    type="date" 
                    className="w-full bg-background-card border-background-lighter"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleFilterSubmit}
              disabled={filterMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {filterMutation.isPending ? "Filtering..." : "Apply Filters"}
              <Filter className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Audit Log Table */}
          <div className="col-span-3">
            <div className="bg-background-card rounded-lg shadow-sm overflow-hidden">
              {isLoading || filterMutation.isPending ? (
                <div className="p-6">
                  <Skeleton className="h-80 bg-background/50" />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-background">
                      <thead className="bg-background">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Event</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Performed By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-background">
                        {currentItems && currentItems.length > 0 ? (
                          currentItems.map((log) => (
                            <tr key={log.id} className="hover:bg-background/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span dangerouslySetInnerHTML={{ 
                                  __html: log.description
                                    .replace(/router\s+(\w+)/gi, 'router <span class="text-primary">$1</span>')
                                    .replace(/user\s+(\w+)/gi, 'user <span class="text-primary">$1</span>')
                                    .replace(/template\s+(\w+)/gi, 'template <span class="text-primary">$1</span>')
                                }}></span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Badge className={`${getEventColor(log.event)}`}>
                                  {log.event}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{log.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{log.performedBy}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">
                              No audit logs found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-background px-4 py-3 flex items-center justify-between border-t border-background-card">
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                            <span className="font-medium">
                              {Math.min(currentPage * itemsPerPage, totalItems)}
                            </span>{" "}
                            of <span className="font-medium">{totalItems}</span> results
                          </p>
                        </div>
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage > 1) {
                                    setCurrentPage(currentPage - 1);
                                  }
                                }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                            
                            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                              const pageNumber = i + 1;
                              return (
                                <PaginationItem key={i}>
                                  <PaginationLink 
                                    href="#" 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(pageNumber);
                                    }}
                                    isActive={pageNumber === currentPage}
                                  >
                                    {pageNumber}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                            
                            <PaginationItem>
                              <PaginationNext 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage < totalPages) {
                                    setCurrentPage(currentPage + 1);
                                  }
                                }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
