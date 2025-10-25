import { useState, useEffect } from 'react'
import { useRealtimeSubscription } from '../hooks/use-realtime'
import { GuardService } from '../lib/services'
import type { Guard } from '../types/database'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { format } from 'date-fns'

export function GuardsList() {
  const [initialData, setInitialData] = useState<Guard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  
  const guardsData = useRealtimeSubscription<Guard>('guards', initialData)

  useEffect(() => {
    const loadGuards = async () => {
      try {
        const data = await GuardService.getAll()
        setInitialData(data)
      } catch (error) {
        console.error('Error loading guards:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGuards()
  }, [])

  const filteredGuards = guardsData.filter(guard => {
    const matchesSearch = guard.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guard.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' ? true : guard.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (guardId: string, newStatus: 'active' | 'inactive') => {
    try {
      await GuardService.update(guardId, { status: newStatus })
    } catch (error) {
      console.error('Error updating guard status:', error)
    }
  }

  if (loading) {
    return <div>Loading guards...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search guards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('active')}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
              Inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuards.map((guard) => (
              <TableRow key={guard.id}>
                <TableCell>{guard.full_name}</TableCell>
                <TableCell>{guard.email}</TableCell>
                <TableCell>{guard.phone || '-'}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    guard.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {guard.status}
                  </span>
                </TableCell>
                <TableCell>{format(new Date(guard.created_at), 'PP')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {guard.status === 'active' ? (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(guard.id, 'inactive')}
                          className="text-red-600"
                        >
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(guard.id, 'active')}
                          className="text-green-600"
                        >
                          Activate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}