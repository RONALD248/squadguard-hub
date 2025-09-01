import { useState } from "react";
import { Calendar, Clock, Plus, Users, MapPin, Edit, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";
import { StatsCard } from "@/components/dashboard/StatsCard";

const scheduleData = [
  {
    id: "SCH001",
    guardName: "John Doe",
    guardId: "GRD001",
    location: "Main Gate",
    shift: "Morning",
    startTime: "08:00",
    endTime: "16:00",
    date: "2024-01-15",
    status: "confirmed",
    notes: "Regular patrol duties",
  },
  {
    id: "SCH002",
    guardName: "Jane Smith",
    guardId: "GRD002",
    location: "Parking Area",
    shift: "Afternoon",
    startTime: "16:00",
    endTime: "00:00",
    date: "2024-01-15",
    status: "pending",
    notes: "Vehicle monitoring",
  },
  {
    id: "SCH003",
    guardName: "Mike Johnson",
    guardId: "GRD003",
    location: "Reception",
    shift: "Night",
    startTime: "22:00",
    endTime: "06:00",
    date: "2024-01-15",
    status: "confirmed",
    notes: "Access control",
  },
  {
    id: "SCH004",
    guardName: "Sarah Wilson",
    guardId: "GRD004",
    location: "Roving Patrol",
    shift: "Morning",
    startTime: "08:00",
    endTime: "16:00",
    date: "2024-01-16",
    status: "unassigned",
    notes: "Mobile patrol",
  },
  {
    id: "SCH005",
    guardName: "David Brown",
    guardId: "GRD005",
    location: "Control Room",
    shift: "Night",
    startTime: "00:00",
    endTime: "08:00",
    date: "2024-01-15",
    status: "confirmed",
    notes: "CCTV monitoring",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-success/10 text-success border-success/20">Confirmed</Badge>;
    case "pending":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    case "unassigned":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Unassigned</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getShiftBadge = (shift: string) => {
  switch (shift) {
    case "Morning":
      return <Badge className="bg-info/10 text-info border-info/20">Morning</Badge>;
    case "Afternoon":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Afternoon</Badge>;
    case "Night":
      return <Badge className="bg-security-navy/10 text-security-navy border-security-navy/20">Night</Badge>;
    default:
      return <Badge variant="secondary">{shift}</Badge>;
  }
};

export default function Schedule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");

  const filteredSchedule = scheduleData.filter((schedule) => {
    const matchesSearch = schedule.guardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.guardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || schedule.status === statusFilter;
    const matchesShift = shiftFilter === "all" || schedule.shift === shiftFilter;
    return matchesSearch && matchesStatus && matchesShift;
  });

  const totalShifts = scheduleData.length;
  const confirmedShifts = scheduleData.filter(s => s.status === "confirmed").length;
  const pendingShifts = scheduleData.filter(s => s.status === "pending").length;
  const unassignedShifts = scheduleData.filter(s => s.status === "unassigned").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shift Schedule</h1>
          <p className="text-muted-foreground mt-2">Manage guard shift assignments and scheduling</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Calendar View
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Shift
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Shift</DialogTitle>
                <DialogDescription>
                  Assign a guard to a new shift schedule
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
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main-gate">Main Gate</SelectItem>
                      <SelectItem value="parking">Parking Area</SelectItem>
                      <SelectItem value="reception">Reception</SelectItem>
                      <SelectItem value="patrol">Roving Patrol</SelectItem>
                      <SelectItem value="control">Control Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shift" className="text-right">Shift</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (08:00 - 16:00)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (16:00 - 00:00)</SelectItem>
                      <SelectItem value="night">Night (00:00 - 08:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <Input type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Additional notes or instructions" 
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Shift</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Shifts"
          value={totalShifts.toString()}
          description="Scheduled shifts"
          icon={Calendar}
          change="+12%"
          changeType="positive"
        />
        <StatsCard
          title="Confirmed"
          value={confirmedShifts.toString()}
          description="Confirmed assignments"
          icon={Users}
          change="+5%"
          changeType="positive"
        />
        <StatsCard
          title="Pending"
          value={pendingShifts.toString()}
          description="Awaiting confirmation"
          icon={Clock}
          change="-2"
          changeType="positive"
        />
        <StatsCard
          title="Unassigned"
          value={unassignedShifts.toString()}
          description="Need assignment"
          icon={MapPin}
          change="0"
          changeType="neutral"
        />
      </div>

      {/* Schedule Management */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Assignments</CardTitle>
          <CardDescription>View and manage guard shift schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
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
              <Select value={shiftFilter} onValueChange={setShiftFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                  <SelectItem value="Night">Night</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guard Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedule.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.guardName}</TableCell>
                    <TableCell>{schedule.guardId}</TableCell>
                    <TableCell>{schedule.date}</TableCell>
                    <TableCell>{getShiftBadge(schedule.shift)}</TableCell>
                    <TableCell className="text-sm">
                      {schedule.startTime} - {schedule.endTime}
                    </TableCell>
                    <TableCell>{schedule.location}</TableCell>
                    <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                    <TableCell className="max-w-32 truncate">{schedule.notes}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
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