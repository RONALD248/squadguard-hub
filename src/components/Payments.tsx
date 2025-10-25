import { useState, useEffect } from 'react'
import { useRealtimeSubscription } from '../hooks/use-realtime'
import { PaymentService, ClientService } from '../lib/services'
import type { Payment, Client } from '../types/database'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { format } from 'date-fns'
import { useToast } from './ui/use-toast'

export function Payments() {
  const [initialData, setInitialData] = useState<Payment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const paymentsData = useRealtimeSubscription<Payment>('payments', initialData)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [paymentsData, clientsData] = await Promise.all([
          PaymentService.getAll(),
          ClientService.getAll(),
        ])
        setInitialData(paymentsData)
        setClients(clientsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCreatePayment = async (data: {
    client_id: string
    amount: number
    payment_date: string
  }) => {
    try {
      await PaymentService.create({
        ...data,
        status: 'pending',
      })
      toast({
        title: 'Success',
        description: 'Payment record created successfully',
      })
    } catch (error) {
      console.error('Error creating payment:', error)
      toast({
        title: 'Error',
        description: 'Failed to create payment record',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateStatus = async (id: string, status: Payment['status']) => {
    try {
      await PaymentService.updateStatus(id, status)
      toast({
        title: 'Success',
        description: 'Payment status updated successfully',
      })
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update payment status',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div>Loading payments...</div>
  }

  const totalRevenue = paymentsData
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const pendingAmount = paymentsData
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium">Pending Payments</h3>
          <p className="text-2xl font-bold">${pendingAmount.toLocaleString()}</p>
        </Card>
      </div>

      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Payment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Payment Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleCreatePayment({
                client_id: formData.get('client_id') as string,
                amount: Number(formData.get('amount')),
                payment_date: new Date(formData.get('payment_date') as string).toISOString(),
              })
            }} className="space-y-4">
              <Select name="client_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                name="amount"
                type="number"
                step="0.01"
                placeholder="Amount"
                required
              />
              <Input
                name="payment_date"
                type="date"
                required
              />
              <Button type="submit">Create Payment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentsData.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.client?.company_name}</TableCell>
                <TableCell>${Number(payment.amount).toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell>{format(new Date(payment.payment_date), 'PP')}</TableCell>
                <TableCell>
                  {payment.status === 'pending' && (
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(payment.id, 'completed')}
                      >
                        Mark Completed
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(payment.id, 'failed')}
                      >
                        Mark Failed
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}