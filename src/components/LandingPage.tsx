
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, BarChart3, Users, ClipboardList, Shield, Zap, Building, Eye, Star } from "lucide-react";

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
              Iniciar Sesión
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Comenzar
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
                Analiza y mejora la participación con enfoque de género
              </h1>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                AssembleaTrack ayuda a tu organización a monitorizar la participación, hacer seguimiento de intervenciones y obtener insights con perspectiva de género para una toma de decisiones más democrática e inclusiva.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/signup')}>
                  Prueba gratis
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Solicitar demo
                </Button>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-lg">
              <Card>
                <CardHeader>
                  <CardTitle>Accede a tu cuenta</CardTitle>
                  <CardDescription>
                    Introduce tu email para iniciar sesión
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@ejemplo.com" />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Contraseña</Label>
                          <a href="#" className="text-sm text-primary underline">
                            ¿Olvidaste tu contraseña?
                          </a>
                        </div>
                        <Input id="password" type="password" />
                      </div>
                      <Button type="submit" className="w-full">
                        Iniciar sesión
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    ¿No tienes cuenta?{" "}
                    <a 
                      href="#" 
                      className="text-primary underline"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/signup');
                      }}
                    >
                      Regístrate
                    </a>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Beneficios con perspectiva de género</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
              Descubre cómo AssembleaTrack puede transformar tus reuniones y asambleas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={<Eye className="h-10 w-10 text-pink-500" />}
              title="Visibiliza desigualdades"
              description="Detecta y visualiza patrones de participación desigual basados en género en tus asambleas y reuniones." 
            />
            <BenefitCard 
              icon={<Users className="h-10 w-10 text-indigo-500" />}
              title="Promueve la diversidad"
              description="Fomenta la participación equilibrada de todos los géneros en tus espacios de toma de decisiones." 
            />
            <BenefitCard 
              icon={<BarChart3 className="h-10 w-10 text-blue-500" />}
              title="Datos desagregados"
              description="Analiza tendencias y comportamientos según género para identificar áreas de mejora." 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Todo lo que necesitas para gestionar tus asambleas</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
              Herramientas potentes para el seguimiento y análisis de la participación democrática
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Análisis en tiempo real"
              description="Obtén información instantánea sobre patrones de participación y duración de intervenciones por género." 
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Seguimiento de asistencia"
              description="Monitoriza quién asiste a tus asambleas y haz seguimiento de su participación a lo largo del tiempo." 
            />
            <FeatureCard 
              icon={<ClipboardList className="h-10 w-10 text-primary" />}
              title="Registro de intervenciones"
              description="Registra y analiza quién habla, durante cuánto tiempo y sobre qué temas, desglosado por género." 
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Datos seguros"
              description="Tus datos de asamblea se almacenan de forma segura y solo son accesibles para usuarios autorizados." 
            />
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Configuración rápida"
              description="Comienza en minutos con nuestra interfaz intuitiva y configuración guiada." 
            />
            <div className="flex items-center justify-center p-8 rounded-lg border bg-card shadow-sm">
              <Button variant="outline" className="w-full">
                Explorar todas las funciones
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Casos de uso</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
              Descubre cómo distintas organizaciones aprovechan AssembleaTrack
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UseCaseCard 
              icon={<Building className="h-10 w-10 text-blue-600" />}
              title="Empresas"
              description="Mejora la inclusión y diversidad en reuniones corporativas monitorizando la participación por género." 
            />
            <UseCaseCard 
              icon={<Users className="h-10 w-10 text-green-600" />}
              title="Asociaciones"
              description="Garantiza que todas las voces sean escuchadas en asambleas y reuniones comunitarias." 
            />
            <UseCaseCard 
              icon={<Star className="h-10 w-10 text-yellow-600" />}
              title="Instituciones"
              description="Implementa políticas de igualdad efectivas basadas en datos reales de participación." 
            />
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
                © 2023 AssembleaTrack. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Privacidad
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Términos
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Contacto
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
    <div className="flex flex-col p-8 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

// Benefit card component
const BenefitCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="flex flex-col p-8 rounded-lg border bg-gradient-to-br from-white to-slate-50 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

// Use Case card component
const UseCaseCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="flex flex-col p-8 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default LandingPage;
