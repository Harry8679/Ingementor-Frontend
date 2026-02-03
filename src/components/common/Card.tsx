import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  gradient = false,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`
        bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-6
        ${hover ? 'hover:shadow-2xl hover:-translate-y-2 transition-all duration-300' : ''}
        ${gradient ? 'bg-linear-to-br from-white to-blue-50' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;