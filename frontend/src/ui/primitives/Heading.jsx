/* ARQUIVO: frontend/src/ui/primitives/Heading.jsx
 * RESPONSAVEL POR: Heading tipografico padrao
 * DEPENDENCIAS: Nenhuma
 */

export default function Heading({ level = 1, className = '', children, ...props }) {
  const Tag = `h${level}`;
  const classes = ['linc-heading', className].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
