import { Alert } from "reactstrap";

export default function ErrorAlert({ errors, onDismiss, className = "" }) {
  if (!errors || errors.length === 0) return null;

  return (
    <Alert
      color="danger"
      toggle={onDismiss}
      className={className}
    >
      {errors.length === 1 ? (
        <p className="mb-0">{errors[0]}</p>
      ) : (
        <ul className="mb-0">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </Alert>
  );
}
