export default function Toasts({ list }) {
  return (
    <div className="toasts">
      {list.map(t => <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>)}
    </div>
  );
}
