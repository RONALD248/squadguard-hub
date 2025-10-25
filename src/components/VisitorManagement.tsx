import { useState, useEffect } from 'react'
import { useRealtimeSubscription } from '../hooks/use-realtime'
import { VisitorService, ClientService } from '../lib/services'
import type { Visitor, Client } from '../types/database'
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

export function VisitorManagement() {
  const [initialData, setInitialData] = useState<Visitor[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()
  
  const visitorsData = useRealtimeSubscription<Visitor>('visitors', initialData)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [visitorsData, clientsData] = await Promise.all([
          VisitorService.getAll(),
          ClientService.getAll(),
        ])
        setInitialData(visitorsData)
        setClients(clientsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCheckIn = async (data: {
    full_name: string
    purpose: string
    client_id: string
  }) => {
    try {
      await VisitorService.checkIn({
        ...data,
        check_in: new Date().toISOString(),
      })
      toast({
        title: 'Success',
        description: 'Visitor checked in successfully',
      })
    } catch (error) {
      console.error('Error checking in visitor:', error)
      toast({
        title: 'Error',
        description: 'Failed to check in visitor',
        variant: 'destructive',
      })
    }
  }

  const handleCheckOut = async (visitorId: string) => {
    try {
      await VisitorService.checkOut(visitorId)
      toast({
        title: 'Success',
        description: 'Visitor checked out successfully',
      })
    } catch (error) {
      console.error('Error checking out visitor:', error)
      toast({
        title: 'Error',
        description: 'Failed to check out visitor',
        variant: 'destructive',
      })
    }
  }

  const filteredVisitors = visitorsData.filter(visitor =>
    visitor.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div>Loading visitors...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search visitors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Check In Visitor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check In Visitor</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleCheckIn({
                full_name: formData.get('full_name') as string,
                purpose: formData.get('purpose') as string,
                client_id: formData.get('client_id') as string,
              })
            }} className="space-y-4">
              <Input name="full_name" placeholder="Visitor Name" required />
              <Input name="purpose" placeholder="Purpose of Visit" required />
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
              <Button type="submit">Check In</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitor Name</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisitors.map((visitor) => (
              <TableRow key={visitor.id}>
                <TableCell>{visitor.full_name}</TableCell>
                <TableCell>{visitor.purpose}</TableCell>
                <TableCell>{visitor.client?.company_name}</TableCell>
                <TableCell>{format(new Date(visitor.check_in), 'PPp')}</TableCell>
                <TableCell>
                  {visitor.check_out
                    ? format(new Date(visitor.check_out), 'PPp')
                    : '-'}
                </TableCell>
                <TableCell>
                  {!visitor.check_out && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCheckOut(visitor.id)}
                    >
                      Check Out
                    </Button>
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