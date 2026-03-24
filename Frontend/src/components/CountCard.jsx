
const Skeleton = () => (
  <div className="h-7 w-14 rounded-md bg-gray-200 animate-pulse" />
);

const CountCard = ({ label, count = "bg-blue-50 text-blue-500" }) => (
  <div
    className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 xl:p-5 flex flex-col gap-2.5 hover:shadow-md transition-shadow duration-200"
    style={{ minWidth: "clamp(7rem, 10vw, 9rem)" }}>
    {count == null ? (
      <Skeleton />
    ) : (
      <span
        className="font-semibold text-gray-700 leading-none tracking-tight"
        style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.875rem)" }}>
        {count.toLocaleString()}
      </span>
    )}
    <span
      className="font-semibold uppercase tracking-wider text-gray-400 leading-tight"
      style={{ fontSize: "clamp(0.58rem, 1vw, 0.7rem)" }}>
      {label}
    </span>
  </div>
);

export default CountCard;
