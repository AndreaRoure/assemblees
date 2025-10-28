import React from 'react';
import logo from '@/assets/logo.png';

const Logo = () => {
  return (
    <div 
      className="h-16 md:h-20 mb-4 w-auto inline-block"
      style={{ 
        backgroundColor: 'rgb(147, 51, 234)',
        maskImage: `url(${logo})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${logo})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        width: 'auto',
        aspectRatio: '3/1'
      }}
    />
  );
};

export default Logo;
