import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'motion/react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ gradient = false, hover = true, className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-3xl p-6 transition-all duration-300';
    const gradientStyles = gradient
      ? 'bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border border-white/20'
      : 'bg-white/90 backdrop-blur-sm shadow-lg shadow-gray-200/50 border border-gray-100/50';
    const hoverStyles = hover ? 'hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1' : '';

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`${baseStyles} ${gradientStyles} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
