/* ARQUIVO: frontend/src/ui/primitives/Text.jsx
 * RESPONSAVEL POR: Texto padrao
 * DEPENDENCIAS: Nenhuma
 */

export default function Text({ as: Tag = 'p', className = '', children, ...props }) {
  const classes = ['linc-text', className].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
