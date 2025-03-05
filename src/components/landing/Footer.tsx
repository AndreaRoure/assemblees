
import React from 'react';

const Footer = () => {
  return (
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
  );
};

export default Footer;
