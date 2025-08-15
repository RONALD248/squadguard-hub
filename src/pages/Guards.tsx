import { useState } from "react";
import { Plus, Search, Filter, Download, User, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Guards() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock guard data
  const guards = [
    {
      id: 1,
      name: "James Okonkwo",
      nationalId: "12345678901",
      contact: "+234-801-111-2222",
      dateHired: "2023-06-15",
      status: "Active",
      shift: "Night Shift",
      location: "Main Gate",
      certifications: ["Basic Security", "First Aid"],
      nextShift: "Tonight 6:00 PM"
    },
    {
      id: 2,
      name: "Mary Adeleke",
      nationalId: "98765432109",
      contact: "+234-802-333-4444",
      dateHired: "2023-08-20",
      status: "Active",
      shift: "Day Shift",
      location: "Reception",
      certifications: ["Basic Security", "Customer Service"],
      nextShift: "Tomorrow 6:00 AM"
    },
    {
      id: 3,
      name: "David Uche",
      nationalId: "11223344556",
      contact: "+234-803-555-6666",
      dateHired: "2023-04-10",
      status: "On Leave",
      shift: "Evening Shift",
      location: "Perimeter",
      certifications: ["Basic Security", "Emergency Response"],
      nextShift: "Return Jan 20"
    }
  ];

  const filteredGuards = guards.filter(guard =>
    guard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guard.shift.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guard.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Guards</h1>
          <p className="text-muted-foreground">Manage security personnel records and assignments</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="security">
                <Plus className="w-4 h-4" />
                Add New Guard
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Register New Security Guard</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="guardName">Full Name</Label>
                  <Input id="guardName" placeholder="Enter guard's full name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nationalId">National ID</Label>
                  <Input id="nationalId" placeholder="Enter national ID number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guardContact">Contact Number</Label>
                  <Input id="guardContact" placeholder="Enter phone number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="shift">Shift Assignment</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day Shift (6AM - 6PM)</SelectItem>
                      <SelectItem value="night">Night Shift (6PM - 6AM)</SelectItem>
                      <SelectItem value="evening">Evening Shift (2PM - 10PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main-gate">Main Gate</SelectItem>
                      <SelectItem value="reception">Reception</SelectItem>
                      <SelectItem value="perimeter">Perimeter</SelectItem>
                      <SelectItem value="parking">Parking Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="security" className="w-full">
                  Register Guard
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-status-success/10 rounded-lg">
                <User className="w-5 h-5 text-status-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">25</div>
                <div className="text-sm text-muted-foreground">Active Guards</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-status-warning/10 rounded-lg">
                <Calendar className="w-5 h-5 text-status-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">On Leave</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-status-info/10 rounded-lg">
                <MapPin className="w-5 h-5 text-status-info" />
              </div>
              <div>
                <div className="text-2xl font-bold">23</div>
                <div className="text-sm text-muted-foreground">On Duty Now</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-security-navy/10 rounded-lg">
                <User className="w-5 h-5 text-security-navy" />
              </div>
              <div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Pending Training</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search guards by name, shift, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guards Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Security Guards ({filteredGuards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>National ID</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date Hired</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Next Shift</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuards.map((guard) => (
                  <TableRow key={guard.id}>
                    <TableCell className="font-medium">{guard.name}</TableCell>
                    <TableCell>{guard.nationalId}</TableCell>
                    <TableCell>{guard.contact}</TableCell>
                    <TableCell>{guard.dateHired}</TableCell>
                    <TableCell>
                      <Badge 
                        className={guard.status === "Active" 
                          ? "bg-status-success text-white" 
                          : guard.status === "On Leave"
                          ? "bg-status-warning text-white"
                          : "bg-security-silver text-security-navy"
                        }
                      >
                        {guard.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{guard.shift}</TableCell>
                    <TableCell>{guard.location}</TableCell>
                    <TableCell>{guard.nextShift}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}