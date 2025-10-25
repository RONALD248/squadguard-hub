import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Guard, Client, Schedule, Attendance, Visitor, Payment } from '../types/database'

type Table = 'guards' | 'clients' | 'schedules' | 'attendance' | 'visitors' | 'payments'
type Record = Guard | Client | Schedule | Attendance | Visitor | Payment

export function useRealtimeSubscription<T extends Record>(
  table: Table,
  initialData: T[] = []
) {
  const [data, setData] = useState<T[]>(initialData)

  useEffect(() => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((current) => [...current, payload.new as T])
          } else if (payload.eventType === 'DELETE') {
            setData((current) =>
              current.filter((item) => item.id !== payload.old.id)
            )
          } else if (payload.eventType === 'UPDATE') {
            setData((current) =>
              current.map((item) =>
                item.id === payload.new.id ? (payload.new as T) : item
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [table])

  return data
}