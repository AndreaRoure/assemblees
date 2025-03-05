
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, BarChart3, Users, ClipboardList, Shield, Zap } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/51fa830a-0b72-4202-b42d-31a2e9040448.png"
              alt="Logo"
              className="h-10"
            />
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              AssembleaTrack
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            <Button variant="outline" onClick={() => navigate('/signin')}>
              Sign in
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Get started
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-5">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Track and analyze assembly participation like never before
              </h1>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                AssembleaTrack helps you monitor participation, track interventions, and gather insights from your assemblies for more democratic and inclusive decision-making.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/signup')}>
                  Start for free
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Book a demo
                </Button>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-lg">
              <Card>
                <CardHeader>
                  <CardTitle>Log in to your account</CardTitle>
                  <CardDescription>
                    Enter your email to sign in to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <a href="#" className="text-sm text-primary underline">
                            Forgot password?
                          </a>
                        </div>
                        <Input id="password" type="password" />
                      </div>
                      <Button type="submit" className="w-full">
                        Sign in
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <a 
                      href="#" 
                      className="text-primary underline"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/signup');
                      }}
                    >
                      Sign up
                    </a>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need to manage your assemblies</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
              Powerful tools for democratic participation tracking and analysis
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Real-time Analytics"
              description="Get instant insights into participation patterns and intervention durations." 
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Attendance Tracking"
              description="Monitor who attends your assemblies and track their participation over time." 
            />
            <FeatureCard 
              icon={<ClipboardList className="h-10 w-10 text-primary" />}
              title="Intervention Recording"
              description="Record and analyze who speaks, for how long, and about what topics." 
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Secure Data"
              description="Your assembly data is securely stored and only accessible to authorized users." 
            />
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Quick Setup"
              description="Get started in minutes with our intuitive interface and guided setup." 
            />
            <div className="flex items-center justify-center p-8 rounded-lg border bg-card shadow-sm">
              <Button variant="outline" className="w-full">
                Explore all features
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/51fa830a-0b72-4202-b42d-31a2e9040448.png"
                alt="Logo"
                className="h-8"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2023 AssembleaTrack. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="flex flex-col p-8 rounded-lg border bg-card shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default LandingPage;
