import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AppTheme } from "../utils/Constants";
import { ThemeProvider } from "@emotion/react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const mobileRegex = /^\d{10}$/; // Exactly 10 digits

  const validateFirstName = (value: string) =>
    !value ? "First Name is required." : "";
  const validateLastName = (value: string) =>
    !value ? "Last Name is required." : "";
  const validateMobile = (value: string) => {
    if (!value) return "Mobile Number is required.";
    if (!mobileRegex.test(value))
      return "Invalid mobile number (10 digits required).";
    return "";
  };
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
  const validateConfirmPassword = (value: string, originalPassword: string) => {
    if (!value) return "Confirm Password is required.";
    if (value !== originalPassword) return "Passwords do not match.";
    return "";
  };

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();

    const fnValidation = validateFirstName(firstName);
    const lnValidation = validateLastName(lastName);
    const mobileValidation = validateMobile(mobile);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(
      confirmPassword,
      password
    );

    setFirstNameError(fnValidation);
    setLastNameError(lnValidation);
    setMobileError(mobileValidation);
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setConfirmPasswordError(confirmPasswordValidation);

    if (
      fnValidation ||
      lnValidation ||
      mobileValidation ||
      emailValidation ||
      passwordValidation ||
      confirmPasswordValidation
    ) {
      return; // Stop if there are validation errors
    }

    // Simulate signup success
    console.log("Signup attempt:", {
      firstName,
      lastName,
      mobile,
      email,
      password,
    });
    navigate("/app");
  };

  return (
    <ThemeProvider theme={AppTheme}>
      <Container
        maxWidth="sm"
        className="min-h-screen flex items-center justify-center p-4 font-inter"
        sx={{ backgroundColor: "page-bg" }}
      >
        <Paper elevation={3} className="p-8 w-full max-w-md text-center">
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignup}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setFirstNameError(validateFirstName(e.target.value));
              }}
              error={!!firstNameError}
              helperText={firstNameError}
              className="mb-4"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setLastNameError(validateLastName(e.target.value));
              }}
              error={!!lastNameError}
              helperText={lastNameError}
              className="mb-4"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Mobile Number"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                setMobileError(validateMobile(e.target.value));
              }}
              error={!!mobileError}
              helperText={mobileError}
              className="mb-4"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
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
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
                setConfirmPasswordError(
                  validateConfirmPassword(confirmPassword, e.target.value)
                ); // Re-validate confirm password
              }}
              error={!!passwordError}
              helperText={passwordError}
              className="mb-4"
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError(
                  validateConfirmPassword(e.target.value, password)
                );
              }}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              className="mb-6"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className="py-3 px-6 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sign Up
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 3 }}
            >
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default SignupPage;
