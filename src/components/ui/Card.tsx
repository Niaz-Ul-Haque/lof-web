import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlighted' | 'outlined';
  onClick?: () => void;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  hoverEffect = true,
}) => {
  const baseClasses = 'rounded-lg overflow-hidden transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-dark-200',
    highlighted: 'bg-dark-200 border-2 border-gold',
    outlined: 'bg-transparent border-2 border-dark-300',
  };
  
  const hoverClasses = hoverEffect
    ? 'hover:shadow-lg hover:-translate-y-1'
    : '';
  
  const clickClasses = onClick ? 'cursor-pointer' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${clickClasses} ${className}`;
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;