import { useState, useEffect } from 'react'
import { useRealtimeSubscription } from '../hooks/use-realtime'
import { AttendanceService } from '../lib/services'
import type { Attendance } from '../types/database'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { format } from 'date-fns'

export function AttendanceList() {
  const [initialData, setInitialData] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const attendanceData = useRealtimeSubscription<Attendance>('attendance', initialData)

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const data = await AttendanceService.getAll()
        setInitialData(data)
      } catch (error) {
        console.error('Error loading attendance:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAttendance()
  }, [])

  const handleCheckOut = async (id: string) => {
    try {
      await AttendanceService.checkOut(id)
    } catch (error) {
      console.error('Error checking out:', error)
    }
  }

  if (loading) {
    return <div>Loading attendance records...</div>
  }

  return (
    <div className="grid gap-4">
      {attendanceData.map((record) => (
        <Card key={record.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{record.guard?.full_name}</h3>
              <p className="text-sm text-gray-500">
                Check in: {format(new Date(record.check_in), 'PPp')}
              </p>
              {record.check_out && (
                <p className="text-sm text-gray-500">
                  Check out: {format(new Date(record.check_out), 'PPp')}
                </p>
              )}
            </div>
            {!record.check_out && (
              <Button
                variant="outline"
                onClick={() => handleCheckOut(record.id)}
              >
                Check Out
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}