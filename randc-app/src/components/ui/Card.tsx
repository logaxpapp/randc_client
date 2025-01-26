// src/components/ui/Card.tsx
import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white shadow-lg rounded p-4 border border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
