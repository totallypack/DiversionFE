import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../managers/authManager";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import FullWidthSection from "./common/FullWidthSection";
import ErrorAlert from "./common/ErrorAlert";

export default function SignUp() {
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

      localStorage.setItem("username", response.username);
      localStorage.setItem("email", response.email);

      navigate("/profile");
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
    <div style={{
      marginTop: "-180px",
      marginBottom: "-20px",
      minHeight: "calc(100vh + 100px)",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Welcome Section*/}
      <FullWidthSection
        backgroundColor="var(--color-light-grey)"
        padding="130px 20px 60px"
        minHeight="250px"
        containerMaxWidth="600px"
      >
        <div style={{ textAlign: "center" }}>
          <h1 className="mb-3">Join Our Community</h1>
          <p className="mb-0">Create an account and start connecting with people who share your interests</p>
        </div>
      </FullWidthSection>

      {/* Form Section*/}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px"
        minHeight="500px"
        containerMaxWidth="500px"
      >
        <div
          style={{
            backgroundColor: "rgba(226, 226, 226, 0.6)",
            padding: "40px",
            borderRadius: "8px",
          }}
        >
          <ErrorAlert errors={errors} />

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
              color="secondary"
              type="submit"
              block
              disabled={loading}
              className="mt-3"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </Form>
        </div>
      </FullWidthSection>

      {/* Login Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-green)"
        padding="60px 20px 150px"
        minHeight="200px"
        containerMaxWidth="600px"
      >
        <div style={{ textAlign: "center" }}>
          <h4 className="mb-3">Already have an account?</h4>
          <p className="mb-3">Welcome back! Sign in to continue your journey.</p>
          <Link to="/login">
            <Button color="dark" outline size="lg">
              Log In Here
            </Button>
          </Link>
        </div>
      </FullWidthSection>
    </div>
  );
}
