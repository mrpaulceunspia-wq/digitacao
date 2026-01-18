/* 📁 ARQUIVO: frontend/src/components/FormField.jsx
 * 🧠 RESPONSÁVEL POR: Campo padrão de formulário (input)
 * 🔗 DEPENDÊNCIAS: MSG
 */

import { MSG } from '../ui/messages/index.js';

export default function FormField({
  labelKey,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  readOnly = false,
  onKeyDown,
  inputRef,
  inputClassName = '',
}) {
  return (
    <label className="linc-field">
      <span className="linc-field__label">{MSG.get('forms', labelKey)}</span>
      <input
        className={['linc-input', inputClassName].filter(Boolean).join(' ')}
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={inputRef}
      />
    </label>
  );
}
