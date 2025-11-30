import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card, CardBody } from "reactstrap";

export default function Home() {
  const isLoggedIn = !!localStorage.getItem("token");
  const username = localStorage.getItem("username");

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="text-center mb-5">
            <h1 className="display-4 mb-3">Welcome to Diversion!</h1>
            <p className="lead text-muted">
              Connect with others who share your special interests
            </p>
          </div>

          {isLoggedIn ? (
            <Card>
              <CardBody>
                <h3 className="mb-4">Welcome back, {username}!</h3>
                <div className="d-grid gap-2">
                  <Button
                    color="primary"
                    size="lg"
                    tag={Link}
                    to="/profile"
                  >
                    Manage Profile
                  </Button>
                  <Button
                    color="outline-secondary"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Log Out
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Row className="g-3">
              <Col md={6}>
                <Card className="h-100">
                  <CardBody className="text-center">
                    <h3 className="mb-3">New User?</h3>
                    <p className="text-muted mb-4">
                      Create an account to start connecting with your community
                    </p>
                    <Button
                      color="primary"
                      size="lg"
                      tag={Link}
                      to="/register"
                      block
                    >
                      Sign Up
                    </Button>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100">
                  <CardBody className="text-center">
                    <h3 className="mb-3">Returning User?</h3>
                    <p className="text-muted mb-4">
                      Log in to access your profile and interests
                    </p>
                    <Button
                      color="success"
                      size="lg"
                      tag={Link}
                      to="/login"
                      block
                    >
                      Log In
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          {!isLoggedIn && (
            <div className="mt-5 text-center">
              <h4 className="mb-3">What is Diversion?</h4>
              <Row className="g-3">
                <Col md={4}>
                  <Card className="bg-light">
                    <CardBody>
                      <h5>Find Your People</h5>
                      <p className="small text-muted">
                        Connect with others who share your interests and passions
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="bg-light">
                    <CardBody>
                      <h5>Join Events</h5>
                      <p className="small text-muted">
                        Discover and participate in community events
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="bg-light">
                    <CardBody>
                      <h5>Express Yourself</h5>
                      <p className="small text-muted">
                        Share your unique interests and identity
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
