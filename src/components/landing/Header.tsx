
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default Header;
