'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  MessageCircle, 
  Phone, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock,
  Smile,
  Activity,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const navigateBack = () => {
    router.push('/');
  };

  const startCall = () => {
    router.push('/call');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e1e] via-[#252526] to-[#000000] text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={navigateBack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="text-sm text-white/60">
          Welcome back, User
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Sessions</CardTitle>
            <Heart className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-xs text-white/60">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Mood Score</CardTitle>
            <Smile className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8.5/10</div>
            <p className="text-xs text-white/60">+0.3 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Active Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">7 days</div>
            <p className="text-xs text-white/60">Keep it up!</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.5h</div>
            <p className="text-xs text-white/60">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl h-full">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button 
                onClick={startCall}
                className="w-full flex items-center space-x-3 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-white/20"
              >
                <Phone className="w-5 h-5 text-green-400" />
                <span className="text-white">Start a Call</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-white/20">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <span className="text-white">Send Message</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-white/20">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-white">Schedule Session</span>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl h-full">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white/5">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Completed call session</p>
                    <p className="text-sm text-white/60">30 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white/5">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Received supportive message</p>
                    <p className="text-sm text-white/60">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white/5">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Smile className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Mood check-in completed</p>
                    <p className="text-sm text-white/60">Yesterday</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white/5">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Wellness assessment</p>
                    <p className="text-sm text-white/60">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-6">
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="text-center">
                  <p className="text-xs text-white/60 mb-2">{day}</p>
                  <div className={`w-full h-16 rounded-lg ${
                    index < 5 ? 'bg-green-500/30 border border-green-400/50' : 'bg-white/10 border border-white/20'
                  } flex items-center justify-center`}>
                    <span className="text-xs text-white">
                      {index < 5 ? '✓' : '○'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
