/* ARQUIVO: frontend/src/ui/primitives/Inline.jsx
 * RESPONSAVEL POR: Linha com gap e wrap
 * DEPENDENCIAS: Nenhuma
 */

export default function Inline({ gap, align = 'center', wrap = true, className = '', children, ...props }) {
  const classes = ['linc-inline', className].filter(Boolean).join(' ');
  const style = gap ? { '--inline-gap': gap } : undefined;
  return (
    <div className={classes} style={style} data-align={align} data-wrap={wrap ? '1' : '0'} {...props}>
      {children}
    </div>
  );
}
