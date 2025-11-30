import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../managers/authManager";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (!username || !password) {
      setErrors(["Please enter both username and password"]);
      return;
    }

    setLoading(true);

    try {
      const response = await login({ username, password });

      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.username);

      navigate("/");
      window.location.reload(); // Refresh to update auth state
    } catch (error) {
      setLoading(false);
      if (error.message) {
        setErrors([error.message]);
      } else {
        setErrors(["Login failed. Please check your credentials."]);
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <CardBody>
              <h2 className="text-center mb-4">Welcome Back!</h2>

              {errors.length > 0 && (
                <Alert color="danger">
                  <ul className="mb-0">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your username"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your password"
                  />
                </FormGroup>

                <Button
                  color="primary"
                  type="submit"
                  block
                  disabled={loading}
                  className="mb-3"
                >
                  {loading ? "Logging in..." : "Log In"}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link to="/register">Sign up here</Link>
                  </p>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
