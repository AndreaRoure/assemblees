
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'es' | 'ca' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations for the app
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Header
    'login': 'Iniciar Sesión',
    'signup': 'Comenzar',
    
    // Hero Section
    'hero.title': 'Analiza la participación por género en tus asambleas',
    'hero.subtitle': 'Herramienta para monitorizar y promover la igualdad de participación en espacios deliberativos',
    'hero.cta': 'Comenzar gratis',
    'hero.secondary': 'Saber más',
    
    // Benefits Section
    'benefits.title': 'Beneficios con perspectiva de género',
    'benefits.subtitle': 'Descubre cómo AssembleaTrack puede transformar tus reuniones y asambleas',
    'benefits.card1.title': 'Visibiliza desigualdades',
    'benefits.card1.description': 'Detecta y visualiza patrones de participación desigual basados en género en tus asambleas y reuniones.',
    'benefits.card2.title': 'Promueve la diversidad',
    'benefits.card2.description': 'Fomenta la participación equilibrada de todos los géneros en tus espacios de toma de decisiones.',
    'benefits.card3.title': 'Datos desagregados',
    'benefits.card3.description': 'Analiza tendencias y comportamientos según género para identificar áreas de mejora.',
    
    // Features Section
    'features.title': 'Todo lo que necesitas para gestionar tus asambleas',
    'features.subtitle': 'Herramientas potentes para el seguimiento y análisis de la participación democrática',
    'features.card1.title': 'Análisis en tiempo real',
    'features.card1.description': 'Obtén información instantánea sobre patrones de participación y duración de intervenciones por género.',
    'features.card2.title': 'Seguimiento de asistencia',
    'features.card2.description': 'Monitoriza quién asiste a tus asambleas y haz seguimiento de su participación a lo largo del tiempo.',
    'features.card3.title': 'Registro de intervenciones',
    'features.card3.description': 'Registra y analiza quién habla, durante cuánto tiempo y sobre qué temas, desglosado por género.',
    'features.card4.title': 'Datos seguros',
    'features.card4.description': 'Tus datos de asamblea se almacenan de forma segura y solo son accesibles para usuarios autorizados.',
    'features.card5.title': 'Configuración rápida',
    'features.card5.description': 'Comienza en minutos con nuestra interfaz intuitiva y configuración guiada.',
    'features.more': 'Explorar todas las funciones',
    
    // Use Cases Section
    'usecases.title': 'Casos de uso',
    'usecases.subtitle': 'Descubre cómo distintas organizaciones aprovechan AssembleaTrack',
    'usecases.card1.title': 'Empresas',
    'usecases.card1.description': 'Mejora la inclusión y diversidad en reuniones corporativas monitorizando la participación por género.',
    'usecases.card2.title': 'Asociaciones',
    'usecases.card2.description': 'Garantiza que todas las voces sean escuchadas en asambleas y reuniones comunitarias.',
    'usecases.card3.title': 'Instituciones',
    'usecases.card3.description': 'Implementa políticas de igualdad efectivas basadas en datos reales de participación.',
    
    // Footer
    'footer.rights': 'Todos los derechos reservados',
    
    // Language selector
    'language': 'Idioma',
    
    // Sign In
    'signin.welcome': 'Bienvenido/a de nuevo',
    'signin.subtitle': 'Inicia sesión en tu cuenta para continuar',
    'signin.title': 'Iniciar sesión',
    'signin.credentials': 'Introduce tus credenciales para acceder a tu cuenta',
    'signin.email': 'Email',
    'signin.password': 'Contraseña',
    'signin.forgot': '¿Olvidaste tu contraseña?',
    'signin.submit': 'Iniciar sesión',
    'signin.noaccount': '¿No tienes cuenta?',
    'signin.register': 'Regístrate',
    'signin.back': 'Volver al inicio',
    
    // Sign Up
    'signup.welcome': 'Crear una cuenta',
    'signup.subtitle': 'Regístrate para comenzar con AssembleaTrack',
    'signup.title': 'Registrarse',
    'signup.info': 'Introduce tu información para crear una cuenta',
    'signup.firstname': 'Nombre',
    'signup.lastname': 'Apellido',
    'signup.email': 'Email',
    'signup.password': 'Contraseña',
    'signup.confirm': 'Confirmar contraseña',
    'signup.submit': 'Registrarse',
    'signup.hasaccount': '¿Ya tienes una cuenta?',
    'signup.signin': 'Iniciar sesión',
    'signup.back': 'Volver al inicio',
  },
  ca: {
    // Header
    'login': 'Iniciar Sessió',
    'signup': 'Començar',
    
    // Hero Section
    'hero.title': 'Analitza la participació per gènere a les teves assemblees',
    'hero.subtitle': 'Eina per monitoritzar i promoure la igualtat de participació en espais deliberatius',
    'hero.cta': 'Començar gratis',
    'hero.secondary': 'Saber més',
    
    // Benefits Section
    'benefits.title': 'Beneficis amb perspectiva de gènere',
    'benefits.subtitle': 'Descobreix com AssembleaTrack pot transformar les teves reunions i assemblees',
    'benefits.card1.title': 'Visibilitza desigualtats',
    'benefits.card1.description': 'Detecta i visualitza patrons de participació desigual basats en gènere a les teves assemblees i reunions.',
    'benefits.card2.title': 'Promou la diversitat',
    'benefits.card2.description': 'Fomenta la participació equilibrada de tots els gèneres als teus espais de presa de decisions.',
    'benefits.card3.title': 'Dades desagregades',
    'benefits.card3.description': 'Analitza tendències i comportaments segons gènere per identificar àrees de millora.',
    
    // Features Section
    'features.title': 'Tot el que necessites per gestionar les teves assemblees',
    'features.subtitle': 'Eines potents per al seguiment i anàlisi de la participació democràtica',
    'features.card1.title': 'Anàlisi en temps real',
    'features.card1.description': 'Obtén informació instantània sobre patrons de participació i durada d\'intervencions per gènere.',
    'features.card2.title': 'Seguiment d\'assistència',
    'features.card2.description': 'Monitoritza qui assisteix a les teves assemblees i fes seguiment de la seva participació al llarg del temps.',
    'features.card3.title': 'Registre d\'intervencions',
    'features.card3.description': 'Registra i analitza qui parla, durant quant temps i sobre quins temes, desglossat per gènere.',
    'features.card4.title': 'Dades segures',
    'features.card4.description': 'Les teves dades d\'assemblea s\'emmagatzemen de forma segura i només són accessibles per a usuaris autoritzats.',
    'features.card5.title': 'Configuració ràpida',
    'features.card5.description': 'Comença en minuts amb la nostra interfície intuïtiva i configuració guiada.',
    'features.more': 'Explorar totes les funcions',
    
    // Use Cases Section
    'usecases.title': 'Casos d\'ús',
    'usecases.subtitle': 'Descobreix com diferents organitzacions aprofiten AssembleaTrack',
    'usecases.card1.title': 'Empreses',
    'usecases.card1.description': 'Millora la inclusió i diversitat en reunions corporatives monitoritzant la participació per gènere.',
    'usecases.card2.title': 'Associacions',
    'usecases.card2.description': 'Garanteix que totes les veus siguin escoltades en assemblees i reunions comunitàries.',
    'usecases.card3.title': 'Institucions',
    'usecases.card3.description': 'Implementa polítiques d\'igualtat efectives basades en dades reals de participació.',
    
    // Footer
    'footer.rights': 'Tots els drets reservats',
    
    // Language selector
    'language': 'Idioma',
    
    // Sign In
    'signin.welcome': 'Benvingut/da de nou',
    'signin.subtitle': 'Inicia sessió al teu compte per continuar',
    'signin.title': 'Iniciar sessió',
    'signin.credentials': 'Introdueix les teves credencials per accedir al teu compte',
    'signin.email': 'Email',
    'signin.password': 'Contrasenya',
    'signin.forgot': 'Has oblidat la contrasenya?',
    'signin.submit': 'Iniciar sessió',
    'signin.noaccount': 'No tens compte?',
    'signin.register': 'Registra\'t',
    'signin.back': 'Tornar a l\'inici',
    
    // Sign Up
    'signup.welcome': 'Crear un compte',
    'signup.subtitle': 'Registra\'t per començar amb AssembleaTrack',
    'signup.title': 'Registrar-se',
    'signup.info': 'Introdueix la teva informació per crear un compte',
    'signup.firstname': 'Nom',
    'signup.lastname': 'Cognom',
    'signup.email': 'Email',
    'signup.password': 'Contrasenya',
    'signup.confirm': 'Confirmar contrasenya',
    'signup.submit': 'Registrar-se',
    'signup.hasaccount': 'Ja tens un compte?',
    'signup.signin': 'Iniciar sessió',
    'signup.back': 'Tornar a l\'inici',
  },
  en: {
    // Header
    'login': 'Sign In',
    'signup': 'Get Started',
    
    // Hero Section
    'hero.title': 'Analyze participation by gender in your assemblies',
    'hero.subtitle': 'Tool to monitor and promote equal participation in deliberative spaces',
    'hero.cta': 'Start for free',
    'hero.secondary': 'Learn more',
    
    // Benefits Section
    'benefits.title': 'Benefits with gender perspective',
    'benefits.subtitle': 'Discover how AssembleaTrack can transform your meetings and assemblies',
    'benefits.card1.title': 'Visualize inequalities',
    'benefits.card1.description': 'Detect and visualize unequal participation patterns based on gender in your assemblies and meetings.',
    'benefits.card2.title': 'Promote diversity',
    'benefits.card2.description': 'Encourage balanced participation of all genders in your decision-making spaces.',
    'benefits.card3.title': 'Disaggregated data',
    'benefits.card3.description': 'Analyze trends and behaviors by gender to identify areas for improvement.',
    
    // Features Section
    'features.title': 'Everything you need to manage your assemblies',
    'features.subtitle': 'Powerful tools for tracking and analyzing democratic participation',
    'features.card1.title': 'Real-time analysis',
    'features.card1.description': 'Get instant information on participation patterns and intervention duration by gender.',
    'features.card2.title': 'Attendance tracking',
    'features.card2.description': 'Monitor who attends your assemblies and track their participation over time.',
    'features.card3.title': 'Intervention records',
    'features.card3.description': 'Record and analyze who speaks, for how long, and on what topics, broken down by gender.',
    'features.card4.title': 'Secure data',
    'features.card4.description': 'Your assembly data is stored securely and only accessible to authorized users.',
    'features.card5.title': 'Quick setup',
    'features.card5.description': 'Get started in minutes with our intuitive interface and guided configuration.',
    'features.more': 'Explore all features',
    
    // Use Cases Section
    'usecases.title': 'Use cases',
    'usecases.subtitle': 'Discover how different organizations leverage AssembleaTrack',
    'usecases.card1.title': 'Companies',
    'usecases.card1.description': 'Improve inclusion and diversity in corporate meetings by monitoring participation by gender.',
    'usecases.card2.title': 'Associations',
    'usecases.card2.description': 'Ensure all voices are heard in assemblies and community meetings.',
    'usecases.card3.title': 'Institutions',
    'usecases.card3.description': 'Implement effective equality policies based on real participation data.',
    
    // Footer
    'footer.rights': 'All rights reserved',
    
    // Language selector
    'language': 'Language',
    
    // Sign In
    'signin.welcome': 'Welcome back',
    'signin.subtitle': 'Sign in to your account to continue',
    'signin.title': 'Sign in',
    'signin.credentials': 'Enter your credentials to access your account',
    'signin.email': 'Email',
    'signin.password': 'Password',
    'signin.forgot': 'Forgot your password?',
    'signin.submit': 'Sign in',
    'signin.noaccount': 'Don\'t have an account?',
    'signin.register': 'Sign up',
    'signin.back': 'Back to home',
    
    // Sign Up
    'signup.welcome': 'Create an account',
    'signup.subtitle': 'Sign up to get started with AssembleaTrack',
    'signup.title': 'Sign up',
    'signup.info': 'Enter your information to create an account',
    'signup.firstname': 'First name',
    'signup.lastname': 'Last name',
    'signup.email': 'Email',
    'signup.password': 'Password',
    'signup.confirm': 'Confirm password',
    'signup.submit': 'Sign up',
    'signup.hasaccount': 'Already have an account?',
    'signup.signin': 'Sign in',
    'signup.back': 'Back to home',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial language from local storage or default to browser language or 'es'
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'es' || browserLang === 'ca' || browserLang === 'en') 
      ? browserLang as Language 
      : 'es';
  };
  
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || getBrowserLanguage();
  };
  
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Update language and save to local storage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Create the context value
  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
