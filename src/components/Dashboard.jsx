import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import NavBar from "./NavBar";

export default function Dashboard() {
  return (
    <>
      <NavBar />
      <Container>
        <Row>
          <Col>
            <h2 className="mb-4">Welcome to Your Dashboard</h2>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <Card>
              <CardBody>
                <CardTitle tag="h4">Your Interests</CardTitle>
                <p className="text-muted">
                  Interests and communities you follow will appear here
                </p>
                <div className="text-center py-4">
                  <em>Coming soon...</em>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <CardBody>
                <CardTitle tag="h4">Upcoming Events</CardTitle>
                <p className="text-muted">
                  Events in your area based on your interests
                </p>
                <div className="text-center py-4">
                  <em>Coming soon...</em>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card>
              <CardBody>
                <CardTitle tag="h4">Recommended For You</CardTitle>
                <p className="text-muted">
                  Discover new interests and events
                </p>
                <div className="text-center py-4">
                  <em>Coming soon...</em>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
