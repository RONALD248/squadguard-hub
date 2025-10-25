import { supabase } from './supabase'
import type { Guard, Client, Schedule, Attendance, Visitor, Payment } from '../types/database'
import * as mock from './mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// If mock mode is enabled, export the mock services so the UI works without a database
if (USE_MOCK) {
  export const GuardService = mock.GuardService
  export const ClientService = mock.ClientService
  export const ScheduleService = mock.ScheduleService
  export const AttendanceService = mock.AttendanceService
  export const VisitorService = mock.VisitorService
  export const PaymentService = mock.PaymentService
} else {
  export const AttendanceService = {
    async getAll() {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, guard:guards(*), schedule:schedules(*)')
        .order('check_in', { ascending: false })

      if (error) throw error
      return data as Attendance[]
    },

    async getByGuardId(guardId: string) {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, guard:guards(*), schedule:schedules(*)')
        .eq('guard_id', guardId)
        .order('check_in', { ascending: false })

      if (error) throw error
      return data as Attendance[]
    },

    async checkIn(guardId: string, scheduleId: string) {
      const { data, error } = await supabase
        .from('attendance')
        .insert({
          guard_id: guardId,
          schedule_id: scheduleId,
          check_in: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data as Attendance
    },

    async checkOut(id: string) {
      const { data, error } = await supabase
        .from('attendance')
        .update({
          check_out: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Attendance
    }
  }

  export const VisitorService = {
    async getAll() {
      const { data, error } = await supabase
        .from('visitors')
        .select('*, client:clients(*)')
        .order('check_in', { ascending: false })

      if (error) throw error
      return data as Visitor[]
    },

    async getByClientId(clientId: string) {
      const { data, error } = await supabase
        .from('visitors')
        .select('*, client:clients(*)')
        .eq('client_id', clientId)
        .order('check_in', { ascending: false })

      if (error) throw error
      return data as Visitor[]
    },

    async checkIn(visitor: Omit<Visitor, 'id' | 'created_at' | 'check_out' | 'client'>) {
      const { data, error } = await supabase
        .from('visitors')
        .insert(visitor)
        .select()
        .single()

      if (error) throw error
      return data as Visitor
    },

    async checkOut(id: string) {
      const { data, error } = await supabase
        .from('visitors')
        .update({
          check_out: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Visitor
    }
  }

  export const PaymentService = {
    async getAll() {
      const { data, error } = await supabase
        .from('payments')
        .select('*, client:clients(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Payment[]
    },

    async getByClientId(clientId: string) {
      const { data, error } = await supabase
        .from('payments')
        .select('*, client:clients(*)')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Payment[]
    },

    async create(payment: Omit<Payment, 'id' | 'created_at' | 'client'>) {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single()

      if (error) throw error
      return data as Payment
    },

    async updateStatus(id: string, status: Payment['status']) {
      const { data, error } = await supabase
        .from('payments')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Payment
    }
  }

  export const GuardService = {
    async getAll() {
      const { data, error } = await supabase
        .from('guards')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Guard[]
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('guards')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Guard
    },

    async create(guard: Omit<Guard, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('guards')
        .insert(guard)
        .select()
        .single()

      if (error) throw error
      return data as Guard
    },

    async update(id: string, guard: Partial<Guard>) {
      const { data, error } = await supabase
        .from('guards')
        .update(guard)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Guard
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('guards')
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  }

  export const ClientService = {
    async getAll() {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Client[]
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Client
    },

    async create(client: Omit<Client, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single()

      if (error) throw error
      return data as Client
    },

    async update(id: string, client: Partial<Client>) {
      const { data, error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Client
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  }

  export const ScheduleService = {
    async getAll() {
      const { data, error } = await supabase
        .from('schedules')
        .select('*, guard:guards(*), client:clients(*)')
        .order('shift_start', { ascending: true })

      if (error) throw error
      return data as Schedule[]
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('schedules')
        .select('*, guard:guards(*), client:clients(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Schedule
    },

    async create(schedule: Omit<Schedule, 'id' | 'created_at' | 'guard' | 'client'>) {
      const { data, error } = await supabase
        .from('schedules')
        .insert(schedule)
        .select()
        .single()

      if (error) throw error
      return data as Schedule
    },

    async update(id: string, schedule: Partial<Schedule>) {
      const { data, error } = await supabase
        .from('schedules')
        .update(schedule)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Schedule
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  }
}