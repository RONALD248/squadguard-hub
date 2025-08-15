import { useState } from "react";
import { Plus, Search, Filter, Camera, Download } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

export default function Visitors() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock visitor data
  const visitors = [
    {
      id: 1,
      name: "John Adebayo",
      idNumber: "A12345678",
      contact: "+234-801-234-5678",
      company: "TechCorp Ltd",
      purpose: "Business Meeting",
      timeIn: "09:30 AM",
      timeOut: null,
      status: "In",
      date: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Okafor",
      idNumber: "B98765432",
      contact: "+234-802-345-6789",
      company: "Global Logistics",
      purpose: "Delivery",
      timeIn: "10:15 AM",
      timeOut: "11:30 AM",
      status: "Out",
      date: "2024-01-15"
    },
    {
      id: 3,
      name: "Michael Chen",
      idNumber: "C11223344",
      contact: "+234-803-456-7890",
      company: "Consultant",
      purpose: "Site Inspection",
      timeIn: "11:00 AM",
      timeOut: null,
      status: "In",
      date: "2024-01-15"
    }
  ];

  const filteredVisitors = visitors.filter(visitor =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Visitor Management</h1>
          <p className="text-muted-foreground">Track and manage all visitors to your premises</p>
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
                Add New Visitor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Register New Visitor</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter visitor's full name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="id">ID/Passport Number</Label>
                  <Input id="id" placeholder="Enter ID or passport number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input id="contact" placeholder="Enter phone number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input id="company" placeholder="Enter company name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purpose">Purpose of Visit</Label>
                  <Textarea id="purpose" placeholder="Describe the purpose of visit" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </Button>
                  <Button variant="security" className="flex-1">
                    Register Visitor
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search visitors by name, company, or purpose..."
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

      {/* Visitors Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Today's Visitors ({filteredVisitors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Time In</TableHead>
                  <TableHead>Time Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">{visitor.name}</TableCell>
                    <TableCell>{visitor.idNumber}</TableCell>
                    <TableCell>{visitor.contact}</TableCell>
                    <TableCell>{visitor.company}</TableCell>
                    <TableCell>{visitor.purpose}</TableCell>
                    <TableCell>{visitor.timeIn}</TableCell>
                    <TableCell>{visitor.timeOut || "-"}</TableCell>
                    <TableCell>
                      <Badge 
                        className={visitor.status === "In" 
                          ? "bg-status-success text-white" 
                          : "bg-security-silver text-security-navy"
                        }
                      >
                        {visitor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {visitor.status === "In" ? (
                        <Button variant="outline" size="sm">
                          Check Out
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      )}
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