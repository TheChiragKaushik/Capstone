import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import type { LoggedInUser } from "../utils/Interfaces";
import { APIEndpoints } from "../api/api";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Patient");

  const navigate = useNavigate();

  // Regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateEmail = (value: string) => {
    if (!value) return "Email is required.";
    if (!emailRegex.test(value)) return "Invalid email format.";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required.";
    if (!passwordRegex.test(value))
      return "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
    return "";
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (emailValidation || passwordValidation) {
      return;
    }

    if (email.includes("@capstone.com")) {
      setRole("Patient");
    } else if (email.includes("@capstone.care")) {
      setRole("Provider");
    } else if (email.includes("@capstone.med")) {
      setRole("Pharmacy");
    }

    let name;
    let userId;
    let loggedInUser: LoggedInUser | null = null;

    try {
      const loginUser = async () => {
        const response = await axios.post(`${APIEndpoints.Login}`, {
          email: email,
          password: password,
        });
        return response.data;
      };

      loggedInUser = await loginUser();

      if (!loggedInUser) {
        throw new Error("Login failed. No user data received.");
      }

      name = loggedInUser.firstName + " " + loggedInUser.lastName;
      userId = loggedInUser._id;
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
      return;
    }

    navigate("/app", {
      state: {
        name: name,
        email: email,
        role: role,
        userId: userId,
      },
    });
  };

  return (
    <Container
      maxWidth="sm"
      className="min-h-screen flex items-center justify-center p-4 font-inter"
      sx={{ backgroundColor: "page-bg" }}
    >
      <Paper elevation={3} className="p-8 w-full max-w-sm text-center">
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value));
            }}
            error={!!emailError}
            helperText={emailError}
            className="mb-4"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(validatePassword(e.target.value));
            }}
            error={!!passwordError}
            helperText={passwordError}
            className="mb-6"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="py-3 px-6 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign In
          </Button>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 3 }}
          >
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
