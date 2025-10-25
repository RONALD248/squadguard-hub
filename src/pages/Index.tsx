import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Shield, Users, Calendar, FileText, BookOpen } from 'lucide-react'

const Index = () => {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Shield className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">SquadGuard Hub</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Complete Security Management System
          </p>
          <Button onClick={() => navigate('/auth')} size="lg">
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 bg-card rounded-lg border text-center">
            <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Guard Management</h3>
            <p className="text-sm text-muted-foreground">Track and manage security personnel</p>
          </div>
          <div className="p-6 bg-card rounded-lg border text-center">
            <Calendar className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Scheduling</h3>
            <p className="text-sm text-muted-foreground">Organize shifts and assignments</p>
          </div>
          <div className="p-6 bg-card rounded-lg border text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Attendance Tracking</h3>
            <p className="text-sm text-muted-foreground">Monitor check-ins and check-outs</p>
          </div>
          <div className="p-6 bg-card rounded-lg border text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Occurrence Book</h3>
            <p className="text-sm text-muted-foreground">Record security incidents</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Professional security management for organizations
          </p>
          <Button onClick={() => navigate('/auth')} variant="outline">
            Sign In
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Index
