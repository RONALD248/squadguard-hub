import { useState } from "react";
import { DollarSign, Download, Plus, Calendar, CreditCard, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Payment {
  id: string;
  guardName: string;
  guardId: string;
  month: string;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  totalAmount: number;
  status: 'paid' | 'pending' | 'processing';
  paymentDate?: string;
  paymentMethod: 'bank_transfer' | 'cash' | 'mobile_money';
}

interface ClientPayment {
  id: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'overdue' | 'pending';
}

const mockPayments: Payment[] = [
  {
    id: "1",
    guardName: "James Mwangi",
    guardId: "G001",
    month: "2024-01",
    baseSalary: 25000,
    overtime: 3000,
    bonuses: 2000,
    deductions: 1000,
    totalAmount: 29000,
    status: "paid",
    paymentDate: "2024-01-30",
    paymentMethod: "bank_transfer"
  },
  {
    id: "2", 
    guardName: "Mary Wanjiku",
    guardId: "G002",
    month: "2024-01",
    baseSalary: 25000,
    overtime: 1500,
    bonuses: 0,
    deductions: 500,
    totalAmount: 26000,
    status: "pending",
    paymentMethod: "mobile_money"
  },
  {
    id: "3",
    guardName: "John Kimani",
    guardId: "G003", 
    month: "2024-01",
    baseSalary: 28000,
    overtime: 4000,
    bonuses: 1000,
    deductions: 800,
    totalAmount: 32200,
    status: "processing",
    paymentMethod: "bank_transfer"
  }
];

const mockClientPayments: ClientPayment[] = [
  {
    id: "1",
    clientName: "Tech Solutions Ltd",
    invoiceNumber: "INV-2024-001",
    amount: 150000,
    dueDate: "2024-02-15",
    paidDate: "2024-02-10",
    status: "paid"
  },
  {
    id: "2",
    clientName: "Metro Shopping Center", 
    invoiceNumber: "INV-2024-002",
    amount: 300000,
    dueDate: "2024-02-20",
    status: "pending"
  },
  {
    id: "3",
    clientName: "Blue Sky Apartments",
    invoiceNumber: "INV-2024-003", 
    amount: 80000,
    dueDate: "2024-01-15",
    status: "overdue"
  }
];

export default function Payments() {
  const [guardPayments] = useState<Payment[]>(mockPayments);
  const [clientPayments] = useState<ClientPayment[]>(mockClientPayments);
  const [selectedMonth, setSelectedMonth] = useState("2024-01");

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-status-success text-white';
      case 'pending': return 'bg-status-warning text-white';
      case 'processing': return 'bg-primary text-white';
      case 'overdue': return 'bg-status-danger text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case 'bank_transfer': return 'Bank Transfer';
      case 'cash': return 'Cash';
      case 'mobile_money': return 'Mobile Money';
      default: return method;
    }
  };

  const totalPayroll = guardPayments.reduce((sum, p) => sum + p.totalAmount, 0);
  const pendingPayroll = guardPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.totalAmount, 0);
  const totalReceivables = clientPayments.reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = clientPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments & Payroll</h1>
          <p className="text-muted-foreground">Manage guard payroll and client payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-primary text-white hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">KES {totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">KES {pendingPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Client Receivables</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">KES {totalReceivables.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding invoices</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-danger">KES {overdueAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payroll" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payroll">Guard Payroll</TabsTrigger>
          <TabsTrigger value="receivables">Client Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll">
          <Card className="border-border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Guard Payroll Management</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-01">January 2024</SelectItem>
                        <SelectItem value="2023-12">December 2023</SelectItem>
                        <SelectItem value="2023-11">November 2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guard</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Bonuses</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guardPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{payment.guardName}</div>
                          <div className="text-sm text-muted-foreground">ID: {payment.guardId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">KES {payment.baseSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground">KES {payment.overtime.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground">KES {payment.bonuses.toLocaleString()}</TableCell>
                      <TableCell className="text-status-danger">-KES {payment.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-foreground">KES {payment.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getPaymentMethodBadge(payment.paymentMethod)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Payslip
                          </Button>
                          {payment.status === 'pending' && (
                            <Button size="sm" className="bg-gradient-primary text-white">
                              Process
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receivables">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Client Payment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium text-foreground">{payment.clientName}</TableCell>
                      <TableCell className="text-foreground">{payment.invoiceNumber}</TableCell>
                      <TableCell className="font-semibold text-foreground">KES {payment.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground">{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-foreground">
                        {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Invoice
                          </Button>
                          {payment.status !== 'paid' && (
                            <Button size="sm" variant="outline">
                              Send Reminder
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}