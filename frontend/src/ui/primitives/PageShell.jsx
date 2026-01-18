/* ARQUIVO: frontend/src/ui/primitives/PageShell.jsx
 * RESPONSAVEL POR: Shell de pagina (card + header)
 * DEPENDENCIAS: Card, Heading
 */

import Card from './Card.jsx';
import Heading from './Heading.jsx';

export default function PageShell({ title, actions, children }) {
  return (
    <Card>
      <div className="linc-page__header">
        <Heading level={1}>{title}</Heading>
        {actions ? <div className="linc-page__actions">{actions}</div> : null}
      </div>
      {children}
    </Card>
  );
}
