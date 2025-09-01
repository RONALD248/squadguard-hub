import { useState } from "react";
import { Clock, CheckCircle, XCircle, Calendar, Download, Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { StatsCard } from "@/components/dashboard/StatsCard";

const attendanceRecords = [
  {
    id: "ATT001",
    guardName: "John Doe",
    guardId: "GRD001",
    date: "2024-01-15",
    checkIn: "08:00",
    checkOut: "16:00",
    location: "Main Gate",
    status: "present",
    hoursWorked: 8.0,
    overtime: 0,
  },
  {
    id: "ATT002",
    guardName: "Jane Smith",
    guardId: "GRD002",
    date: "2024-01-15",
    checkIn: "09:15",
    checkOut: "17:00",
    location: "Parking Area",
    status: "late",
    hoursWorked: 7.75,
    overtime: 0,
  },
  {
    id: "ATT003",
    guardName: "Mike Johnson",
    guardId: "GRD003",
    date: "2024-01-15",
    checkIn: "-",
    checkOut: "-",
    location: "Reception",
    status: "absent",
    hoursWorked: 0,
    overtime: 0,
  },
  {
    id: "ATT004",
    guardName: "Sarah Wilson",
    guardId: "GRD004",
    date: "2024-01-15",
    checkIn: "08:00",
    checkOut: "18:30",
    location: "Roving Patrol",
    status: "overtime",
    hoursWorked: 10.5,
    overtime: 2.5,
  },
  {
    id: "ATT005",
    guardName: "David Brown",
    guardId: "GRD005",
    date: "2024-01-15",
    checkIn: "08:00",
    checkOut: "16:00",
    location: "Control Room",
    status: "present",
    hoursWorked: 8.0,
    overtime: 0,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "present":
      return <Badge className="bg-success/10 text-success border-success/20">Present</Badge>;
    case "late":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Late</Badge>;
    case "absent":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Absent</Badge>;
    case "overtime":
      return <Badge className="bg-info/10 text-info border-info/20">Overtime</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Attendance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch = record.guardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.guardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPresent = attendanceRecords.filter(r => r.status === "present" || r.status === "overtime").length;
  const totalLate = attendanceRecords.filter(r => r.status === "late").length;
  const totalAbsent = attendanceRecords.filter(r => r.status === "absent").length;
  const totalOvertime = attendanceRecords.reduce((sum, r) => sum + r.overtime, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Guard Attendance</h1>
          <p className="text-muted-foreground mt-2">Track and manage security guard attendance records</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Clock className="w-4 h-4" />
                Manual Check-in
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manual Check-in/Check-out</DialogTitle>
                <DialogDescription>
                  Record attendance for guards who cannot use the automated system
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guard" className="text-right">Guard</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select guard" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GRD001">John Doe (GRD001)</SelectItem>
                      <SelectItem value="GRD002">Jane Smith (GRD002)</SelectItem>
                      <SelectItem value="GRD003">Mike Johnson (GRD003)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input id="location" placeholder="Guard location" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="action" className="text-right">Action</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checkin">Check In</SelectItem>
                      <SelectItem value="checkout">Check Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Record Attendance</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Present Today"
          value={totalPresent.toString()}
          description="Guards currently on duty"
          icon={CheckCircle}
          change="+2%"
          changeType="positive"
        />
        <StatsCard
          title="Late Arrivals"
          value={totalLate.toString()}
          description="Guards who arrived late"
          icon={Clock}
          change="-1"
          changeType="positive"
        />
        <StatsCard
          title="Absent Today"
          value={totalAbsent.toString()}
          description="Guards not present"
          icon={XCircle}
          change="+1"
          changeType="negative"
        />
        <StatsCard
          title="Overtime Hours"
          value={totalOvertime.toString()}
          description="Total overtime today"
          icon={Calendar}
          change="+0.5h"
          changeType="neutral"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>View and manage daily attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by guard name, ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <DatePickerWithRange
                date={selectedDate}
                onDateChange={setSelectedDate}
                className="w-auto"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="overtime">Overtime</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guard Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.guardName}</TableCell>
                    <TableCell>{record.guardId}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>{record.hoursWorked}h</TableCell>
                    <TableCell>{record.overtime > 0 ? `${record.overtime}h` : '-'}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
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