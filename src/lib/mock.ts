import type { Guard, Client, Schedule, Attendance, Visitor, Payment } from '../types/database'

const uid = () => Math.random().toString(36).slice(2, 9)
const now = () => new Date().toISOString()

// In-memory stores
const guards: Guard[] = [
  { id: uid(), full_name: 'John Doe', email: 'john@example.com', phone: '555-0100', status: 'active', created_at: now() },
  { id: uid(), full_name: 'Jane Smith', email: 'jane@example.com', phone: '555-0101', status: 'active', created_at: now() },
]

const clients: Client[] = [
  { id: uid(), company_name: 'Acme Corp', contact_person: 'Alice', email: 'alice@acme.com', phone: '555-0200', address: '1 Acme Way', created_at: now() },
  { id: uid(), company_name: 'Globex', contact_person: 'Bob', email: 'bob@globex.com', phone: '555-0201', address: '100 Globex Plaza', created_at: now() },
]

const schedules: Schedule[] = [
  { id: uid(), guard_id: guards[0].id, client_id: clients[0].id, shift_start: new Date().toISOString(), shift_end: new Date(Date.now() + 4 * 3600 * 1000).toISOString(), created_at: now(), guard: guards[0], client: clients[0] },
]

const attendance: Attendance[] = []
const visitors: Visitor[] = []
const payments: Payment[] = []

export const GuardService = {
  async getAll() { return [...guards] },
  async getById(id: string) { return guards.find(g => g.id === id) as Guard },
  async create(g: Omit<Guard, 'id' | 'created_at'>) {
    const newG: Guard = { ...g, id: uid(), created_at: now() }
    guards.unshift(newG)
    return newG
  },
  async update(id: string, g: Partial<Guard>) {
    const idx = guards.findIndex(x => x.id === id)
    if (idx === -1) throw new Error('Not found')
    guards[idx] = { ...guards[idx], ...g }
    return guards[idx]
  },
  async delete(id: string) { const idx = guards.findIndex(x => x.id === id); if (idx !== -1) guards.splice(idx,1) }
}

export const ClientService = {
  async getAll() { return [...clients] },
  async getById(id: string) { return clients.find(c => c.id === id) as Client },
  async create(c: Omit<Client, 'id' | 'created_at'>) { const newC: Client = { ...c, id: uid(), created_at: now() }; clients.unshift(newC); return newC },
  async update(id: string, c: Partial<Client>) { const idx = clients.findIndex(x => x.id === id); if (idx === -1) throw new Error('Not found'); clients[idx] = { ...clients[idx], ...c }; return clients[idx] },
  async delete(id: string) { const idx = clients.findIndex(x => x.id === id); if (idx !== -1) clients.splice(idx,1) }
}

export const ScheduleService = {
  async getAll() { return schedules.map(s => ({ ...s })) },
  async getById(id: string) { return schedules.find(s => s.id === id) as Schedule },
  async create(s: Omit<Schedule, 'id' | 'created_at' | 'guard' | 'client'>) { const guard = guards.find(g => g.id === s.guard_id)!; const client = clients.find(c => c.id === s.client_id)!; const newS: Schedule = { ...s, id: uid(), created_at: now(), guard, client }; schedules.unshift(newS); return newS },
  async update(id: string, s: Partial<Schedule>) { const idx = schedules.findIndex(x => x.id === id); if (idx === -1) throw new Error('Not found'); schedules[idx] = { ...schedules[idx], ...s }; return schedules[idx] },
  async delete(id: string) { const idx = schedules.findIndex(x => x.id === id); if (idx !== -1) schedules.splice(idx,1) }
}

export const AttendanceService = {
  async getAll() { return [...attendance] },
  async getByGuardId(guardId: string) { return attendance.filter(a => a.guard_id === guardId) },
  async checkIn(guardId: string, scheduleId: string) { const newA: Attendance = { id: uid(), guard_id: guardId, schedule_id: scheduleId, check_in: now(), created_at: now() }; attendance.unshift(newA); return newA },
  async checkOut(id: string) { const a = attendance.find(x => x.id === id); if (!a) throw new Error('Not found'); a.check_out = now(); return a }
}

export const VisitorService = {
  async getAll() { return [...visitors] },
  async getByClientId(clientId: string) { return visitors.filter(v => v.client_id === clientId) },
  async checkIn(visitor: Omit<Visitor, 'id' | 'created_at' | 'check_out' | 'client'>) { const newV: Visitor = { ...visitor, id: uid(), created_at: now() }; visitors.unshift(newV); return newV },
  async checkOut(id: string) { const v = visitors.find(x => x.id === id); if (!v) throw new Error('Not found'); v.check_out = now(); return v }
}

export const PaymentService = {
  async getAll() { return [...payments] },
  async getByClientId(clientId: string) { return payments.filter(p => p.client_id === clientId) },
  async create(payment: Omit<Payment, 'id' | 'created_at' | 'client'>) { const newP: Payment = { ...payment, id: uid(), created_at: now() }; payments.unshift(newP); return newP },
  async updateStatus(id: string, status: Payment['status']) { const p = payments.find(x => x.id === id); if (!p) throw new Error('Not found'); p.status = status; return p }
}

export default {
  GuardService,
  ClientService,
  ScheduleService,
  AttendanceService,
  VisitorService,
  PaymentService,
}
