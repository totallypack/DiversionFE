import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../managers/authManager";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import FullWidthSection from "./common/FullWidthSection";
import ErrorAlert from "./common/ErrorAlert";

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

      localStorage.setItem("username", response.username);

      navigate("/dashboard");
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
          <h1 className="mb-3">Welcome Back!</h1>
          <p className="mb-0">Sign in to continue your journey</p>
        </div>
      </FullWidthSection>

      {/* Form Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px"
        minHeight="400px"
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
              <Label for="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                placeholder="Enter your username"
                autoComplete="on"
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
              color="secondary"
              type="submit"
              block
              disabled={loading}
              className="mt-3"
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </Form>
        </div>
      </FullWidthSection>

      {/* Sign Up Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-green)"
        padding="60px 20px 150px"
        minHeight="200px"
        containerMaxWidth="600px"
      >
        <div style={{ textAlign: "center" }}>
          <h4 className="mb-3">Don't have an account?</h4>
          <p className="mb-3">Join our community and start connecting with people who share your interests!</p>
          <Link to="/signup">
            <Button color="dark" outline size="lg">
              Sign Up Here
            </Button>
          </Link>
        </div>
      </FullWidthSection>
    </div>
  );
}
