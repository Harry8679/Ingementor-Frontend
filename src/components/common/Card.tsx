import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  gradient = false 
}) => {
  return (
    <div className={`
      bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-6
      ${hover ? 'hover:shadow-2xl hover:-translate-y-2 transition-all duration-300' : ''}
      ${gradient ? 'bg-linear-to-br from-white to-blue-50' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;