import { Container } from "reactstrap";

export default function FullWidthSection({
  backgroundColor,
  padding = "80px 20px",
  minHeight = "400px",
  containerMaxWidth = "1200px",
  children,
  className = "",
}) {
  return (
    <section
      style={{
        backgroundColor,
        width: "100vw",
        margin: 0,
        padding,
        minHeight,
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
      }}
      className={className}
    >
      <Container style={{ maxWidth: containerMaxWidth }}>{children}</Container>
    </section>
  );
}
