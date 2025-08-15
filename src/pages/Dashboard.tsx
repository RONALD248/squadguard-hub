import { Users, Shield, Clock, AlertTriangle, CreditCard, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Mock data for demonstration
  const statsData = [
    {
      title: "Today's Visitors",
      value: 47,
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      description: "from yesterday"
    },
    {
      title: "Guards on Duty",
      value: 23,
      change: "3 pending",
      changeType: "neutral" as const,
      icon: Shield,
      description: "out of 30 total"
    },
    {
      title: "Pending Payments",
      value: "₦245,000",
      change: "-5%",
      changeType: "positive" as const,
      icon: CreditCard,
      description: "from last month"
    },
    {
      title: "Active Alerts",
      value: 3,
      change: "2 urgent",
      changeType: "negative" as const,
      icon: AlertTriangle,
      description: "require attention"
    }
  ];

  const recentVisitors = [
    { name: "John Adebayo", company: "TechCorp Ltd", timeIn: "09:30 AM", purpose: "Business Meeting", status: "In" },
    { name: "Sarah Okafor", company: "Global Logistics", timeIn: "10:15 AM", purpose: "Delivery", status: "Out" },
    { name: "Michael Chen", company: "Consultant", timeIn: "11:00 AM", purpose: "Site Inspection", status: "In" },
    { name: "Fatima Hassan", company: "ABC Construction", timeIn: "08:45 AM", purpose: "Project Review", status: "Out" }
  ];

  const upcomingShifts = [
    { guard: "James Okonkwo", shift: "Night Shift", time: "6:00 PM - 6:00 AM", location: "Main Gate" },
    { guard: "Mary Adeleke", shift: "Day Shift", time: "6:00 AM - 6:00 PM", location: "Reception" },
    { guard: "David Uche", shift: "Evening Shift", time: "2:00 PM - 10:00 PM", location: "Perimeter" }
  ];

  const alerts = [
    { type: "Urgent", message: "Unauthorized entry attempt at East Gate", time: "2 minutes ago" },
    { type: "Warning", message: "Guard shift change overdue - Main Gate", time: "15 minutes ago" },
    { type: "Info", message: "Monthly security report due tomorrow", time: "1 hour ago" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground">Overview of Squad Three Security operations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Generate Report</Button>
          <Button className="bg-gradient-primary text-white hover:opacity-90">
            Add New Visitor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Visitors */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVisitors.map((visitor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{visitor.name}</div>
                    <div className="text-sm text-muted-foreground">{visitor.company}</div>
                    <div className="text-xs text-muted-foreground">{visitor.purpose}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-medium">{visitor.timeIn}</div>
                    <Badge 
                      className={visitor.status === "In" 
                        ? "bg-status-success text-white" 
                        : "bg-security-silver text-security-navy"
                      }
                    >
                      {visitor.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge 
                      className={
                        alert.type === "Urgent" 
                          ? "bg-status-danger text-white" 
                          : alert.type === "Warning"
                          ? "bg-status-warning text-white"
                          : "bg-status-info text-white"
                      }
                    >
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Shifts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming Guard Shifts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingShifts.map((shift, index) => (
              <div key={index} className="p-4 bg-gradient-silver rounded-lg">
                <div className="font-medium text-security-navy">{shift.guard}</div>
                <div className="text-sm text-security-navy/80">{shift.shift}</div>
                <div className="text-sm text-security-navy/80">{shift.time}</div>
                <div className="text-xs text-security-navy/60 mt-2">{shift.location}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}