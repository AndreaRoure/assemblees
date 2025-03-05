
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
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
  );
};

export default HeroSection;
