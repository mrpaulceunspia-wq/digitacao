/* ARQUIVO: frontend/src/pages/DigitacaoPage.jsx
 * RESPONSAVEL POR: Tela de cadastro de digitacao + calculos + busca OF
 * DEPENDENCIAS: hooks, services, components, MSG, notifier, AppContext
 */

import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import FormField from '../components/FormField.jsx';
import OfSearchModal from '../components/OfSearchModal.jsx';
import SelectField from '../components/SelectField.jsx';
import { useApp } from '../contexts/AppContext.jsx';
import { atualizarDigitacao, buscarDigitacao, criarDigitacao } from '../services/digitacoesApi.js';
import { listMotivos } from '../services/motivosApi.js';
import { listPessoas } from '../services/pessoasApi.js';
import { buscarGramatura, buscarOfs } from '../services/protheusApi.js';
import { MSG } from '../ui/messages/index.js';
import { notifier } from '../ui/notify/notifier.js';
import { Card, Heading, Text } from '../ui/primitives/index.js';

function toMinutes(hhmm) {
  const m = String(hhmm || '').match(/^(\d{2}):(\d{2})$/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 60 + mm;
}

function diffMinutes(start, end) {
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (s === null || e === null) return null;
  return e - s;
}

function formatMinutes(min) {
  if (min === null || min === undefined) return '';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function parseDecimal(value) {
  if (value === null || value === undefined) return NaN;
  const normalized = String(value).replace(',', '.');
  return Number(normalized);
}

function calcGram({ pesoLiquido, metros, largura }) {
  const p = parseDecimal(pesoLiquido);
  const m = parseDecimal(metros);
  const l = parseDecimal(largura);
  if ([p, m, l].some((n) => Number.isNaN(n))) return null;
  if (p <= 0 || m <= 0 || l <= 0) return null;
  const v = (p / m / l) * 1000000;
  return Math.round(v * 100) / 100;
}

export default function DigitacaoPage() {
  const { fibras, linhas, turnos } = useApp();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const formScopeRef = useRef(null);

  const [linha, setLinha] = useState('');
  const [data, setData] = useState('');
  const [turno, setTurno] = useState('');

  const [operadorId, setOperadorId] = useState('');
  const [ajudanteId, setAjudanteId] = useState('');

  const [ofNumeroBusca, setOfNumeroBusca] = useState('');
  const [ofNumero, setOfNumero] = useState('');
  const [ofItem, setOfItem] = useState('');
  const [codProduto, setCodProduto] = useState('');
  const [produto, setProduto] = useState('');
  const [cliente, setCliente] = useState('');

  const [numBobina, setNumBobina] = useState('');
  const [pesoLiquido, setPesoLiquido] = useState('');
  const [metros, setMetros] = useState('');
  const [largura, setLargura] = useState('');
  const [gramMedia, setGramMedia] = useState('');
  const [gramDe, setGramDe] = useState('');
  const [gramAte, setGramAte] = useState('');
  const [gramCriterio, setGramCriterio] = useState('');

  const [inicio, setInicio] = useState('');
  const [termino, setTermino] = useState('');
  const [tempoMin, setTempoMin] = useState(null);

  const [tipoFibra, setTipoFibra] = useState('');
  const [numRolinhos, setNumRolinhos] = useState('');
  const [peso, setPeso] = useState('');
  const [colaNumero, setColaNumero] = useState('');
  const [colaCarga, setColaCarga] = useState('');
  const [pesoRefugo, setPesoRefugo] = useState('');
  const [aprovado, setAprovado] = useState('');

  const [paradaInicio, setParadaInicio] = useState('');
  const [paradaFim, setParadaFim] = useState('');
  const [tempoParadaMin, setTempoParadaMin] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [operadores, setOperadores] = useState([]);
  const [ajudantes, setAjudantes] = useState([]);
  const [motivos, setMotivos] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [ofItems, setOfItems] = useState([]);
  const [ofSuggestions, setOfSuggestions] = useState([]);
  const [ofSuggestOpen, setOfSuggestOpen] = useState(false);
  const [ofSuggestLoading, setOfSuggestLoading] = useState(false);
  const [ofSuggestError, setOfSuggestError] = useState('');

  const ignoreSuggestRef = useRef(false);
  const blurTimeoutRef = useRef(null);

  const minOfQueryLength = 3;

  function getFocusableFields() {
    if (!formScopeRef.current) return [];
    const nodes = formScopeRef.current.querySelectorAll(
      'input.linc-input, select.linc-select, textarea.linc-textarea',
    );
    return Array.from(nodes).filter((node) => !node.disabled && node.offsetParent !== null);
  }

  function moveFocus(current, direction) {
    const fields = getFocusableFields();
    const idx = fields.indexOf(current);
    if (idx === -1) return;
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= fields.length) return;
    fields[nextIdx].focus();
  }

  function handleFieldKeyDown(e) {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches('input.linc-input, select.linc-select, textarea.linc-textarea')) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    if (e.key === 'Enter') {
      if (target.tagName === 'TEXTAREA' && !e.shiftKey) {
        return;
      }
      e.preventDefault();
      moveFocus(target, 1);
    }

    if (e.key === 'Backspace') {
      if (target.tagName === 'TEXTAREA') return;
      const value = target.value ?? '';
      if (String(value).length === 0) {
        e.preventDefault();
        moveFocus(target, -1);
      }
    }
  }

  function asPessoaOptions(list) {
    return list.map((p) => ({ value: String(p.id), label: p.nome }));
  }

  useEffect(() => {
    Promise.all([listPessoas({ papel: 'OPERADOR' }), listPessoas({ papel: 'AJUDANTE' })])
      .then(([ops, ajs]) => {
        setOperadores(asPessoaOptions(ops));
        setAjudantes(asPessoaOptions(ajs));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    listMotivos()
      .then((list) => {
        const options = list.map((m) => ({ value: m.codigo, label: `${m.codigo} - ${m.motivo}` }));
        setMotivos(options);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (data) return;
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setData(`${yyyy}-${mm}-${dd}`);
  }, [data]);

  useEffect(() => {
    if (!isEdit) return;
    buscarDigitacao(id)
      .then((row) => {
        setLinha(row.linha ? String(row.linha) : '');
        setData(row.data || '');
        setTurno(row.turno || '');
        setOperadorId(row.operador_id ? String(row.operador_id) : '');
        setAjudanteId(row.ajudante_id ? String(row.ajudante_id) : '');

        setOfNumeroBusca(row.of_numero || '');
        setOfNumero(row.of_numero || '');
        setOfItem(row.of_item || '');
        setCodProduto(row.cod_produto || '');
        setProduto(row.produto || '');
        setCliente(row.cliente || '');

        setNumBobina(row.num_bobina || '');
        setPesoLiquido(row.peso_liquido ?? '');
        setMetros(row.metros ?? '');
        setLargura(row.largura ?? '');
        setGramMedia(row.gram_media ?? '');

        setInicio(row.inicio || '');
        setTermino(row.termino || '');
        setTempoMin(row.tempo_min ?? null);

        setTipoFibra(row.tipo_fibra || '');
        setNumRolinhos(row.num_rolinhos ?? '');
        setPeso(row.peso ?? '');
        setColaNumero(row.cola_numero || '');
        setColaCarga(row.cola_carga || '');
        setPesoRefugo(row.peso_refugo ?? '');
        setAprovado(row.aprovado === null || row.aprovado === undefined ? '' : String(row.aprovado));

        setParadaInicio(row.parada_inicio || '');
        setParadaFim(row.parada_fim || '');
        setTempoParadaMin(row.tempo_parada_min ?? null);
        setMotivo(row.motivo || '');
        setObservacoes(row.observacoes || '');
      })
      .catch(() => {});
  }, [id, isEdit]);

  // Calculo Tempo
  useEffect(() => {
    if (!inicio || !termino) {
      setTempoMin(null);
      return;
    }
    const d = diffMinutes(inicio, termino);
    if (d === null) {
      setTempoMin(null);
      return;
    }
    if (d < 0) {
      notifier.say('error', 'validation', 'timeNegative', { field: MSG.get('forms', 'tempo') });
      setTempoMin(null);
      return;
    }
    setTempoMin(d);
  }, [inicio, termino]);

  // Calculo Tempo Parada
  useEffect(() => {
    if (!paradaInicio || !paradaFim) {
      setTempoParadaMin(null);
      return;
    }
    const d = diffMinutes(paradaInicio, paradaFim);
    if (d === null) {
      setTempoParadaMin(null);
      return;
    }
    if (d < 0) {
      notifier.say('error', 'validation', 'timeNegative', { field: MSG.get('forms', 'tempoParada') });
      setTempoParadaMin(null);
      return;
    }
    setTempoParadaMin(d);
  }, [paradaInicio, paradaFim]);

  // Calculo Gram. Media
  useEffect(() => {
    const v = calcGram({ pesoLiquido, metros, largura });
    if (v === null) {
      setGramMedia('');
      return;
    }
    setGramMedia(String(v.toFixed(2)).replace('.', ','));
  }, [pesoLiquido, metros, largura]);

  useEffect(() => {
    if (!linha || !codProduto) {
      setGramDe('');
      setGramAte('');
      setGramCriterio('');
      return;
    }

    buscarGramatura(codProduto, linha)
      .then((data) => {
        setGramDe(data?.gramDe ? String(data.gramDe).replace('.', ',') : '');
        setGramAte(data?.gramAte ? String(data.gramAte).replace('.', ',') : '');
        setGramCriterio(data?.criterio || '');
      })
      .catch(() => {
        setGramDe('');
        setGramAte('');
        setGramCriterio('');
      });
  }, [linha, codProduto]);

  const gramValue = parseDecimal(gramMedia);
  const gramDeValue = parseDecimal(gramDe);
  const gramAteValue = parseDecimal(gramAte);
  const gramStatus =
    Number.isNaN(gramValue) || Number.isNaN(gramDeValue) || Number.isNaN(gramAteValue)
      ? ''
      : gramValue >= gramDeValue && gramValue <= gramAteValue
      ? 'ok'
      : 'warn';

  useEffect(() => {
    const query = ofNumeroBusca.trim();
    setOfSuggestError('');
    if (!query) {
      setOfSuggestions([]);
      setOfSuggestOpen(false);
      return;
    }
    if (query.length < minOfQueryLength) {
      setOfSuggestions([]);
      setOfSuggestOpen(false);
      return;
    }
    if (ignoreSuggestRef.current) {
      ignoreSuggestRef.current = false;
      return;
    }

    setOfSuggestLoading(true);
    setOfSuggestOpen(true);
    const handle = setTimeout(() => {
      buscarOfs(query)
        .then((res) => {
          const items = res.items || [];
          setOfSuggestions(items);
          setOfSuggestOpen(true);
        })
        .catch(() => {
          setOfSuggestions([]);
          setOfSuggestError(MSG.get('protheus', 'searchError'));
          setOfSuggestOpen(true);
        })
        .finally(() => setOfSuggestLoading(false));
    }, 350);

    return () => clearTimeout(handle);
  }, [ofNumeroBusca]);

  async function onBuscarOf() {
    if (!ofNumeroBusca.trim()) {
      notifier.say('warn', 'validation', 'required', { field: MSG.get('forms', 'ofNumero') });
      return;
    }
    const res = await buscarOfs(ofNumeroBusca.trim());
    setOfItems(res.items || []);
    setModalOpen(true);
  }

  function onSelectOf(it) {
    ignoreSuggestRef.current = true;
    setOfNumeroBusca(it.ofNumero);
    setOfNumero(it.ofNumero);
    setOfItem(it.ofItem);
    setCodProduto(it.codProduto);
    setProduto(it.produto);
    setCliente(it.cliente || '');
    setModalOpen(false);
    setOfSuggestions([]);
    setOfSuggestOpen(false);
    setOfSuggestError('');

    if (linha && it.codProduto) {
      buscarGramatura(it.codProduto, linha)
        .then((data) => {
          setGramDe(data?.gramDe ? String(data.gramDe).replace('.', ',') : '');
          setGramAte(data?.gramAte ? String(data.gramAte).replace('.', ',') : '');
          setGramCriterio(data?.criterio || '');
        })
        .catch(() => {
          setGramDe('');
          setGramAte('');
          setGramCriterio('');
        });
    }
  }

  function handleOfFocus() {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    if (ofSuggestions.length) {
      setOfSuggestOpen(true);
    }
  }

  function handleOfBlur() {
    blurTimeoutRef.current = setTimeout(() => {
      setOfSuggestOpen(false);
    }, 160);
  }

  function validateRequired() {
    const required = [
      [ofNumero, MSG.get('forms', 'ofNumero')],
      [codProduto, MSG.get('forms', 'codProduto')],
      [produto, MSG.get('forms', 'produto')],
      [cliente, MSG.get('forms', 'cliente')],
      [numBobina, MSG.get('forms', 'numBobina')],
      [pesoLiquido, MSG.get('forms', 'pesoLiquido')],
      [metros, MSG.get('forms', 'metros')],
      [largura, MSG.get('forms', 'largura')],
      [termino, MSG.get('forms', 'termino')],
    ];

    const missing = required.find((r) => !String(r[0] || '').trim());
    if (missing) {
      notifier.say('warn', 'validation', 'required', { field: missing[1] });
      return false;
    }
    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateRequired()) return;

    const payload = {
      linha: Number(linha),
      data,
      turno,
      operadorId: Number(operadorId),
      ajudanteId: ajudanteId ? Number(ajudanteId) : null,

      ofNumero,
      ofItem,
      codProduto,
      produto,
      cliente: cliente || null,

      numBobina: numBobina || null,
      pesoLiquido: pesoLiquido ? Number(String(pesoLiquido).replace(',', '.')) : null,
      metros: metros ? Number(String(metros).replace(',', '.')) : null,
      largura: largura ? Number(String(largura).replace(',', '.')) : null,
      gramMedia: gramMedia ? Number(String(gramMedia).replace(',', '.')) : null,

      inicio: inicio || null,
      termino: termino || null,
      tempoMin,

      tipoFibra: tipoFibra || null,
      numRolinhos: numRolinhos ? Number(numRolinhos) : null,
      peso: peso ? Number(String(peso).replace(',', '.')) : null,

      colaNumero: colaNumero || null,
      colaCarga: colaCarga || null,
      pesoRefugo: pesoRefugo ? Number(String(pesoRefugo).replace(',', '.')) : null,
      aprovado: aprovado === '' ? null : Number(aprovado),

      paradaInicio: paradaInicio || null,
      paradaFim: paradaFim || null,
      tempoParadaMin,
      motivo: motivo || null,

      observacoes: observacoes || null,
    };

    if (isEdit) {
      await atualizarDigitacao(id, payload);
      notifier.success(MSG.get('general', 'updated'));
    } else {
      await criarDigitacao(payload);
      notifier.success(MSG.get('digitacao', 'saved'));
    }
  }

  return (
    <Card ref={formScopeRef} onKeyDown={handleFieldKeyDown}>
      <div className="linc-page__header">
        <Heading level={1}>{isEdit ? MSG.get('digitacao', 'editTitle') : MSG.get('digitacao', 'title')}</Heading>
      </div>

      <div className="linc-grid linc-grid--of">
        <label className="linc-field">
          <span className="linc-field__label">{MSG.get('forms', 'ofNumero')}</span>
          <div className="linc-suggest">
            <input
              className="linc-input"
              value={ofNumeroBusca}
              onChange={(e) => setOfNumeroBusca(e.target.value)}
              onFocus={handleOfFocus}
              onBlur={handleOfBlur}
              placeholder={MSG.get('digitacao', 'ofSearchPlaceholder')}
            />
            {ofSuggestOpen && (
              <div className="linc-suggest__list">
                {ofSuggestLoading ? (
                  <div className="linc-suggest__empty">{MSG.get('protheus', 'searching')}</div>
                ) : ofSuggestError ? (
                  <div className="linc-suggest__empty">{ofSuggestError}</div>
                ) : ofSuggestions.length ? (
                  ofSuggestions.map((it) => (
                    <button
                      key={`${it.ofNumero}-${it.ofItem}`}
                      className="linc-suggest__item"
                      type="button"
                      onClick={() => onSelectOf(it)}
                    >
                      <span className="linc-suggest__title">{`${it.ofNumero} / ${it.ofItem}`}</span>
                      <span className="linc-suggest__meta">{`${it.codProduto} - ${it.produto}`}</span>
                      <span className="linc-suggest__meta">{it.cliente || ''}</span>
                    </button>
                  ))
                ) : (
                  <div className="linc-suggest__empty">{MSG.get('protheus', 'notFound')}</div>
                )}
              </div>
            )}
          </div>
        </label>
        <div className="linc-actions">
          <button className="btn btn--secondary" type="button" onClick={onBuscarOf}>
            {MSG.get('protheus', 'searchOf')}
          </button>
        </div>
      </div>

      <form className="linc-grid" onSubmit={onSubmit}>
        <SelectField labelKey="linha" value={linha} onChange={setLinha} options={linhas} allowEmpty={false} />
        <FormField labelKey="data" type="date" value={data} onChange={setData} />
        <SelectField labelKey="turno" value={turno} onChange={setTurno} options={turnos} allowEmpty={false} />

        <SelectField labelKey="operador" value={operadorId} onChange={setOperadorId} options={operadores} />
        <SelectField labelKey="ajudante" value={ajudanteId} onChange={setAjudanteId} options={ajudantes} />

        <FormField labelKey="ofNumero" value={ofNumero} onChange={setOfNumero} readOnly />
        <FormField labelKey="ofItem" value={ofItem} onChange={setOfItem} readOnly />
        <FormField labelKey="codProduto" value={codProduto} onChange={setCodProduto} readOnly />
        <FormField labelKey="produto" value={produto} onChange={setProduto} readOnly />
        <FormField labelKey="cliente" value={cliente} onChange={setCliente} readOnly />

        <FormField labelKey="numBobina" value={numBobina} onChange={setNumBobina} />
        <FormField labelKey="pesoLiquido" value={pesoLiquido} onChange={setPesoLiquido} />
        <FormField labelKey="metros" value={metros} onChange={setMetros} />
        <FormField labelKey="largura" value={largura} onChange={setLargura} />
        <FormField labelKey="gramDe" value={gramDe} onChange={setGramDe} readOnly />
        <FormField labelKey="gramAte" value={gramAte} onChange={setGramAte} readOnly />
        <FormField
          labelKey="gramMedia"
          value={gramMedia}
          onChange={setGramMedia}
          readOnly
          inputClassName={gramStatus ? `linc-input--${gramStatus}` : ''}
        />

        <FormField labelKey="inicio" type="time" value={inicio} onChange={setInicio} />
        <FormField labelKey="termino" type="time" value={termino} onChange={setTermino} />
        <FormField labelKey="tempo" value={tempoMin === null ? '' : formatMinutes(tempoMin)} onChange={() => {}} readOnly />

        <SelectField labelKey="tipoFibra" value={tipoFibra} onChange={setTipoFibra} options={fibras} />
        <FormField labelKey="numRolinhos" value={numRolinhos} onChange={setNumRolinhos} />
        <FormField labelKey="peso" value={peso} onChange={setPeso} />
        <FormField labelKey="colaNumero" value={colaNumero} onChange={setColaNumero} />
        <FormField labelKey="colaCarga" value={colaCarga} onChange={setColaCarga} />
        <FormField labelKey="pesoRefugo" value={pesoRefugo} onChange={setPesoRefugo} />

        <SelectField
          labelKey="aprovado"
          value={aprovado}
          onChange={setAprovado}
          options={[
            { value: '1', label: MSG.get('general', 'yes') },
            { value: '0', label: MSG.get('general', 'no') },
          ]}
        />

        <FormField labelKey="paradaInicio" type="time" value={paradaInicio} onChange={setParadaInicio} />
        <FormField labelKey="paradaFim" type="time" value={paradaFim} onChange={setParadaFim} />
        <FormField
          labelKey="tempoParada"
          value={tempoParadaMin === null ? '' : formatMinutes(tempoParadaMin)}
          onChange={() => {}}
          readOnly
        />

        <SelectField labelKey="motivo" value={motivo} onChange={setMotivo} options={motivos} />
        <div className="linc-actions linc-actions--start">
          <Link className="btn btn--ghost" to="/motivos">
            {MSG.get('motivos', 'add')}
          </Link>
        </div>
        {gramCriterio ? (
          <Text className="linc-field--full">{MSG.get('digitacao', 'gramCriterio', { criterio: gramCriterio })}</Text>
        ) : null}
        <label className="linc-field linc-field--full">
          <span className="linc-field__label">{MSG.get('forms', 'observacoes')}</span>
          <textarea className="linc-textarea" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
        </label>

        <div className="linc-actions linc-field--full">
          <button className="btn btn--primary" type="submit">
            {isEdit ? MSG.get('general', 'update') : MSG.get('general', 'save')}
          </button>
        </div>
      </form>

      <OfSearchModal open={modalOpen} items={ofItems} onSelect={onSelectOf} onClose={() => setModalOpen(false)} />
    </Card>
  );
}
