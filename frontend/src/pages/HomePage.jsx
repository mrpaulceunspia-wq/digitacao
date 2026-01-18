/* ARQUIVO: frontend/src/pages/HomePage.jsx
 * RESPONSAVEL POR: Pagina inicial
 * DEPENDENCIAS: MSG, primitivos
 */

import { MSG } from '../ui/messages/index.js';
import { PageShell, Text } from '../ui/primitives/index.js';

export default function HomePage() {
  return (
    <PageShell title={MSG.get('general', 'appTitle')}>
      <Text>{MSG.get('general', 'homeHint')}</Text>
    </PageShell>
  );
}
