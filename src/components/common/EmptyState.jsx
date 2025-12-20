import { Button } from "reactstrap";
import { Link } from "react-router-dom";

export default function EmptyState({
  title,
  message,
  actionText,
  actionLink,
  secondaryActionText,
  secondaryActionLink,
  backgroundColor = "rgba(226, 226, 226, 0.6)",
  className = "",
}) {
  return (
    <div
      style={{
        backgroundColor,
        padding: "60px 30px",
        borderRadius: "8px",
        textAlign: "center",
      }}
      className={className}
    >
      {title && <h4>{title}</h4>}
      {message && <p className="text-muted mb-3">{message}</p>}

      {(actionText || secondaryActionText) && (
        <div className="d-flex gap-2 justify-content-center">
          {actionText && actionLink && (
            <Button color="dark" size="sm" tag={Link} to={actionLink}>
              {actionText}
            </Button>
          )}
          {secondaryActionText && secondaryActionLink && (
            <Button
              color="dark"
              outline
              size="sm"
              tag={Link}
              to={secondaryActionLink}
            >
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
