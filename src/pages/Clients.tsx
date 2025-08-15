import { useState } from "react";
import { Plus, Search, Building, Phone, MapPin, Calendar, DollarSign, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  contractStart: string;
  contractEnd: string;
  monthlyRate: number;
  status: 'active' | 'inactive' | 'pending';
  guardsAssigned: number;
}

const mockClients: Client[] = [
  {
    id: "1",
    companyName: "Tech Solutions Ltd",
    contactPerson: "John Doe",
    email: "john@techsolutions.com",
    phone: "+254 700 123 456",
    address: "Westlands, Nairobi",
    contractStart: "2024-01-15",
    contractEnd: "2024-12-31",
    monthlyRate: 150000,
    status: "active",
    guardsAssigned: 3
  },
  {
    id: "2",
    companyName: "Metro Shopping Center",
    contactPerson: "Sarah Johnson",
    email: "security@metrocenter.com",
    phone: "+254 722 987 654",
    address: "Kilimani, Nairobi",
    contractStart: "2024-03-01",
    contractEnd: "2025-02-28",
    monthlyRate: 300000,
    status: "active",
    guardsAssigned: 6
  },
  {
    id: "3",
    companyName: "Blue Sky Apartments",
    contactPerson: "Mike Wilson",
    email: "manager@bluesky.co.ke",
    phone: "+254 733 456 789",
    address: "Karen, Nairobi",
    contractStart: "2024-02-10",
    contractEnd: "2024-08-10",
    monthlyRate: 80000,
    status: "pending",
    guardsAssigned: 2
  }
];

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    status: 'pending'
  });

  const filteredClients = clients.filter(client =>
    client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-status-success text-white';
      case 'inactive': return 'bg-status-danger text-white';
      case 'pending': return 'bg-status-warning text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalRevenue = clients
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.monthlyRate, 0);

  const handleAddClient = () => {
    if (newClient.companyName && newClient.contactPerson && newClient.email) {
      const client: Client = {
        id: Date.now().toString(),
        companyName: newClient.companyName,
        contactPerson: newClient.contactPerson,
        email: newClient.email,
        phone: newClient.phone || '',
        address: newClient.address || '',
        contractStart: newClient.contractStart || new Date().toISOString().split('T')[0],
        contractEnd: newClient.contractEnd || '',
        monthlyRate: newClient.monthlyRate || 0,
        status: newClient.status as 'active' | 'inactive' | 'pending' || 'pending',
        guardsAssigned: 0
      };
      setClients([...clients, client]);
      setNewClient({ status: 'pending' });
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
          <p className="text-muted-foreground">Manage your security contracts and client relationships</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={newClient.companyName || ''}
                  onChange={(e) => setNewClient({...newClient, companyName: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={newClient.contactPerson || ''}
                  onChange={(e) => setNewClient({...newClient, contactPerson: e.target.value})}
                  placeholder="Enter contact person"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email || ''}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newClient.phone || ''}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newClient.address || ''}
                  onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                  placeholder="Enter full address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractStart">Contract Start</Label>
                <Input
                  id="contractStart"
                  type="date"
                  value={newClient.contractStart || ''}
                  onChange={(e) => setNewClient({...newClient, contractStart: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractEnd">Contract End</Label>
                <Input
                  id="contractEnd"
                  type="date"
                  value={newClient.contractEnd || ''}
                  onChange={(e) => setNewClient({...newClient, contractEnd: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyRate">Monthly Rate (KES)</Label>
                <Input
                  id="monthlyRate"
                  type="number"
                  value={newClient.monthlyRate || ''}
                  onChange={(e) => setNewClient({...newClient, monthlyRate: Number(e.target.value)})}
                  placeholder="Enter monthly rate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newClient.status} onValueChange={(value) => setNewClient({...newClient, status: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClient} className="bg-gradient-primary text-white">
                Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{clients.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Contracts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {clients.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              KES {totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Guards Deployed</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {clients.reduce((sum, c) => sum + c.guardsAssigned, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search clients by name, contact, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contract Period</TableHead>
                <TableHead>Monthly Rate</TableHead>
                <TableHead>Guards</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{client.companyName}</div>
                      <div className="text-sm text-muted-foreground">{client.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{client.contactPerson}</div>
                      <div className="text-sm text-muted-foreground">{client.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                      {client.address}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    <div className="text-sm">
                      <div>{new Date(client.contractStart).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">to {new Date(client.contractEnd).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground font-medium">
                    KES {client.monthlyRate.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {client.guardsAssigned}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-status-danger hover:text-status-danger">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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