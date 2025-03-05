
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from '@/components/Logo';

const SignIn = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Logo />
          <h1 className="text-2xl font-bold mt-4 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Bienvenido/a de nuevo
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Inicia sesión en tu cuenta para continuar
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Iniciar sesión</CardTitle>
            <CardDescription>
              Introduce tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@ejemplo.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <a 
                    href="#" 
                    className="text-sm text-primary underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>
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
        
        <div className="text-center mt-4">
          <a 
            href="#" 
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
