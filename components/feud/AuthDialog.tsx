import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, LogIn, UserPlus } from "lucide-react"

interface AuthDialogProps {
  authMode: "login" | "register"
  setAuthMode: (mode: "login" | "register") => void
  authForm: { username: string; email: string; password: string }
  setAuthForm: (form: { username: string; email: string; password: string }) => void
  handleAuth: () => void
}

const AuthDialog: React.FC<AuthDialogProps> = ({ authMode, setAuthMode, authForm, setAuthForm, handleAuth }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/idle-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <Card className="w-full max-w-md bg-gray-900/90 border-gray-800 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-white mb-2">Family Feud</CardTitle>
            <p className="text-gray-400">Admin Control Center</p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "register")}> 
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800">
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-600">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-blue-600">
                Register
              </TabsTrigger>
            </TabsList>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                <Input
                  id="username"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                  placeholder="Enter password"
                />
              </div>
              <Button
                onClick={handleAuth}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {authMode === "login" ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthDialog 