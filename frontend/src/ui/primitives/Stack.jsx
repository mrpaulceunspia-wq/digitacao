/* ARQUIVO: frontend/src/ui/primitives/Stack.jsx
 * RESPONSAVEL POR: Coluna com gap
 * DEPENDENCIAS: Nenhuma
 */

export default function Stack({ gap, className = '', children, ...props }) {
  const classes = ['linc-stack', className].filter(Boolean).join(' ');
  const style = gap ? { '--stack-gap': gap } : undefined;
  return (
    <div className={classes} style={style} {...props}>
      {children}
    </div>
  );
}
