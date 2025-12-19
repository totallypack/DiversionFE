import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button } from "reactstrap";

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("username");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div style={{
      marginTop: "-180px",
      marginBottom: "-20px",
      minHeight: "calc(100vh + 100px)",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Hero Section - Cyan */}
      <section
        style={{
          backgroundColor: "var(--color-cyan)",
          width: "100vw",
          margin: 0,
          padding: "150px 20px 100px",
          minHeight: "400px",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
        }}
      >
        <Container style={{ maxWidth: "900px", textAlign: "center" }}>
          <h1 className="display-3 mb-4">Welcome to Diversion!</h1>
          <p className="lead mb-5" style={{ fontSize: "1.5rem" }}>
            Connect with others who share your special interests
          </p>
          {!isLoggedIn && (
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/register">
                <Button color="dark" size="lg" style={{ minWidth: "180px" }}>
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button color="dark" outline size="lg" style={{ minWidth: "180px" }}>
                  Log In
                </Button>
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Features Section - Purple */}
      <section
        style={{
          backgroundColor: "var(--color-purple)",
          width: "100vw",
          margin: 0,
          padding: "80px 20px",
          minHeight: "400px",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
        }}
      >
        <Container style={{ maxWidth: "1000px" }}>
          <h2 className="text-center mb-5">What is Diversion?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div
                style={{
                  backgroundColor: "rgba(226, 226, 226, 0.6)",
                  padding: "30px",
                  borderRadius: "8px",
                  height: "100%",
                  textAlign: "center",
                }}
              >
                <h4 className="mb-3">Find Your People</h4>
                <p className="text-muted">
                  Connect with others who share your interests and passions
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div
                style={{
                  backgroundColor: "rgba(226, 226, 226, 0.6)",
                  padding: "30px",
                  borderRadius: "8px",
                  height: "100%",
                  textAlign: "center",
                }}
              >
                <h4 className="mb-3">Join Events</h4>
                <p className="text-muted">
                  Discover and participate in community events
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div
                style={{
                  backgroundColor: "rgba(226, 226, 226, 0.6)",
                  padding: "30px",
                  borderRadius: "8px",
                  height: "100%",
                  textAlign: "center",
                }}
              >
                <h4 className="mb-3">Express Yourself</h4>
                <p className="text-muted">
                  Share your unique interests and identity
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section - Light Green */}
      <section
        style={{
          backgroundColor: "var(--color-light-green)",
          width: "100vw",
          margin: 0,
          padding: "80px 20px",
          paddingBottom: "150px",
          minHeight: "300px",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Container style={{ maxWidth: "700px", textAlign: "center" }}>
          <h2 className="mb-4">Ready to Get Started?</h2>
          <p className="lead mb-4">
            Join our community today and start connecting with people who understand you
          </p>
          {!isLoggedIn && (
            <Link to="/register">
              <Button color="primary" size="lg">
                Create Your Account
              </Button>
            </Link>
          )}
        </Container>
      </section>
    </div>
  );
}
