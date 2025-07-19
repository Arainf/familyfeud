import React from "react"
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Sparkles } from "lucide-react"

interface HeaderBarProps {
  user: { username: string }
  handleLogout: () => void
}

const HeaderBar: React.FC<HeaderBarProps> = ({ user, handleLogout }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Family Feud Control</h1>
          <p className="text-gray-300">Welcome back, {user.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  </div>
)

export default HeaderBar 