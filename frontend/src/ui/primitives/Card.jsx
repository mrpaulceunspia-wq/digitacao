/* ARQUIVO: frontend/src/ui/primitives/Card.jsx
 * RESPONSAVEL POR: Wrapper de card padrao
 * DEPENDENCIAS: Nenhuma
 */

import { forwardRef } from 'react';

const Card = forwardRef(function Card({ as: Tag = 'section', className = '', children, ...props }, ref) {
  const classes = ['linc-card', className].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} className={classes} {...props}>
      {children}
    </Tag>
  );
});

export default Card;
