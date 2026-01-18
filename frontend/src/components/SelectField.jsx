/* 📁 ARQUIVO: frontend/src/components/SelectField.jsx
 * 🧠 RESPONSÁVEL POR: Campo select padrão
 * 🔗 DEPENDÊNCIAS: MSG
 */

import { MSG } from '../ui/messages/index.js';

export default function SelectField({ labelKey, value, onChange, options, allowEmpty = true }) {
  return (
    <label className="linc-field">
      <span className="linc-field__label">{MSG.get('forms', labelKey)}</span>
      <select className="linc-select" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {allowEmpty ? <option value="">{MSG.get('general', 'emptyOption')}</option> : null}
        {options.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </label>
  );
}
