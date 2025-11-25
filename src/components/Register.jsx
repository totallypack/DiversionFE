  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { register } from "../managers/authManager";
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

  export default function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
      email: "",
      username: "",
      password: "",
    });

    const navigate = useNavigate();

    const validateEmail = (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        return "Email is required";
      } else if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
      return "";
    };

    const validateUsername = (value) => {
      const usernameRegex = /^[a-zA-Z0-9]+$/;
      if (!value) {
        return "Username is required";
      } else if (value.length < 3 || value.length > 20) {
        return "Username must be between 3 and 20 characters";
      } else if (!usernameRegex.test(value)) {
        return "Username must be alphanumeric";
      }
      return "";
    };

    const validatePassword = (value) => {
      if (!value) {
        return "Password is required";
      } else if (value.length < 8) {
        return "Password must be at least 8 characters";
      }
      return "";
    };

    const handleEmailChange = (e) => {
      const value = e.target.value;
      setEmail(value);
      setFieldErrors({ ...fieldErrors, email: validateEmail(value) });
    };

    const handleUsernameChange = (e) => {
      const value = e.target.value;
      setUsername(value);
      setFieldErrors({ ...fieldErrors, username: validateUsername(value) });
    };

    const handlePasswordChange = (e) => {
      const value = e.target.value;
      setPassword(value);
      setFieldErrors({ ...fieldErrors, password: validatePassword(value) });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrors([]);

      const emailError = validateEmail(email);
      const usernameError = validateUsername(username);
      const passwordError = validatePassword(password);

      setFieldErrors({
        email: emailError,
        username: usernameError,
        password: passwordError,
      });

      if (emailError || usernameError || passwordError) {
        return;
      }

      setLoading(true);

      try {
        const response = await register({ email, username, password });

        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.username);
        localStorage.setItem("email", response.email);

        navigate("/");
      } catch (error) {
        setLoading(false);
        if (error.errors) {
          setErrors(error.errors);
        } else if (error.message) {
          setErrors([error.message]);
        } else {
          setErrors(["Registration failed. Please try again."]);
        }
      }
    };

    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <CardBody>
                <h2 className="text-center mb-4">Create Your Account</h2>

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
                    <Label for="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      invalid={!!fieldErrors.email}
                      disabled={loading}
                    />
                    {fieldErrors.email && (
                      <div className="text-danger small mt-1">
                        {fieldErrors.email}
                      </div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      invalid={!!fieldErrors.username}
                      disabled={loading}
                    />
                    {fieldErrors.username && (
                      <div className="text-danger small mt-1">
                        {fieldErrors.username}
                      </div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      invalid={!!fieldErrors.password}
                      disabled={loading}
                    />
                    {fieldErrors.password && (
                      <div className="text-danger small mt-1">
                        {fieldErrors.password}
                      </div>
                    )}
                    <div className="small text-muted mt-1">
                      Minimum 8 characters, include uppercase, lowercase, and numbers
                    </div>
                  </FormGroup>

                  <Button
                    color="primary"
                    type="submit"
                    block
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
