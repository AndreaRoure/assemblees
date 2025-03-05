
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from '@/components/Logo';
import { useLanguage } from '@/contexts/LanguageContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
            {t('signup.welcome')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            {t('signup.subtitle')}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t('signup.title')}</CardTitle>
            <CardDescription>
              {t('signup.info')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('signup.firstname')}</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('signup.lastname')}</Label>
                  <Input id="lastName" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('signup.email')}</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('signup.password')}</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('signup.confirm')}</Label>
                <Input id="confirmPassword" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                {t('signup.submit')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {t('signup.hasaccount')}{" "}
              <a 
                href="#" 
                className="text-primary underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signin');
                }}
              >
                {t('signup.signin')}
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
            {t('signup.back')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
