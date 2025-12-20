import { Spinner } from "reactstrap";

export default function LoadingSpinner({
  message = "Loading...",
  color = "dark",
  size,
  className = "",
}) {
  return (
    <div className={`text-center py-5 ${className}`}>
      <Spinner color={color} size={size} />
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
