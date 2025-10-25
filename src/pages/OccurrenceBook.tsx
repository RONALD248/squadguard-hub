import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { BookOpen, Plus } from 'lucide-react'
import { format } from 'date-fns'

type Occurrence = {
  id: string
  title: string
  description: string
  incident_date: string
  reported_by: string
  severity: string
  status: string
  location: string
  created_at: string
}

export default function OccurrenceBook() {
  const { user } = useAuth()
  const [occurrences, setOccurrences] = useState<Occurrence[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incident_date: new Date().toISOString().slice(0, 16),
    severity: 'low',
    location: '',
  })

  useEffect(() => {
    loadOccurrences()
  }, [])

  const loadOccurrences = async () => {
    try {
      const { data, error } = await supabase
        .from('occurrence_book')
        .select('*')
        .order('incident_date', { ascending: false })

      if (error) throw error
      setOccurrences(data || [])
    } catch (error: any) {
      toast.error('Failed to load occurrences')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('You must be logged in')
      return
    }

    try {
      const { error } = await supabase
        .from('occurrence_book')
        .insert({
          ...formData,
          reported_by: user.id,
          status: 'open'
        })

      if (error) throw error

      toast.success('Occurrence recorded successfully')
      setOpen(false)
      setFormData({
        title: '',
        description: '',
        incident_date: new Date().toISOString().slice(0, 16),
        severity: 'low',
        location: '',
      })
      loadOccurrences()
    } catch (error: any) {
      toast.error(error.message || 'Failed to record occurrence')
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'default'
      case 'investigating':
        return 'default'
      case 'resolved':
        return 'secondary'
      case 'closed':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Occurrence Book</h1>
            <p className="text-muted-foreground">Record and track security incidents</p>
          </div>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Occurrence
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record New Occurrence</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description of incident"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of what occurred"
                  rows={5}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incident_date">Incident Date & Time</Label>
                  <Input
                    id="incident_date"
                    type="datetime-local"
                    value={formData.incident_date}
                    onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) => setFormData({ ...formData, severity: value })}
                  >
                    <SelectTrigger id="severity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Where did this occur?"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Occurrence</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Occurrences</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : occurrences.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No occurrences recorded yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Incident Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {occurrences.map((occurrence) => (
                    <TableRow key={occurrence.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{occurrence.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {occurrence.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(occurrence.incident_date), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{occurrence.location || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(occurrence.severity)}>
                          {occurrence.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(occurrence.status)}>
                          {occurrence.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
