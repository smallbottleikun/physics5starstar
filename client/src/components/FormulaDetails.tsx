import type { Formula } from '../physics-content';
import MathFormula from './MathFormula';

export default function FormulaDetails({ formula, showZh = true }: { formula: Formula; showZh?: boolean }) {
  return <div className="formula-details space-y-5">
    <div><p className="lesson-en">{formula.description}</p>{showZh && <p className="lesson-zh">{formula.descriptionZh}</p>}</div>
    {!!formula.symbols?.length && <div>
      <h4 className="text-sm mb-3">Symbols & units {showZh && '· 字母與單位'}</h4>
      <div className="space-y-2">{formula.symbols.map((sym, i) => <div key={i} className="lesson-symbol">
        <div className="font-mono font-semibold text-sm" style={{ color: 'var(--lesson-accent, var(--color-cyan))' }}>{sym.symbol.includes('\\') ? <MathFormula latex={sym.symbol} /> : sym.symbol}</div>
        <div><p className="lesson-en text-sm">{sym.meaning}</p>{showZh && <p className="lesson-zh">{sym.meaningZh}</p>}</div>
        <span className="lesson-unit">{sym.unit}</span>
      </div>)}</div>
    </div>}
    {!!formula.rearrangements?.length && <div>
      <h4 className="text-sm mb-3">Solve for each symbol {showZh && '· 每個字母怎樣求'}</h4>
      <div className="space-y-3">{formula.rearrangements.map((item, i) => <div key={i} className="lesson-rearrangement">
        <p className="text-xs font-mono font-bold" style={{ color: 'var(--color-cyan)' }}>Find {item.target}</p>
        <MathFormula latex={item.latex} />
        <p className="lesson-en text-sm">{item.note}</p>{showZh && <p className="lesson-zh">{item.noteZh}</p>}
      </div>)}</div>
    </div>}
  </div>;
}
