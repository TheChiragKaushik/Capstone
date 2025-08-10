import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import type { LoggedInUser } from "../../utils/Interfaces";
import { APIEndpoints } from "../../api/api";
import { Button, IconButton, InputAdornment } from "@mui/material";
import { colors } from "../../utils/Constants";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

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

      let role: string = "Patient";

      if (email.includes("@capstone.com")) {
        role = "Patient";
        name = loggedInUser.firstName + " " + loggedInUser.lastName;
      } else if (email.includes("@capstone.care")) {
        role = "Provider";
        name = loggedInUser.firstName + " " + loggedInUser.lastName;
      } else if (email.includes("@capstone.med")) {
        role = "Pharmacy";
        name = loggedInUser.name;
      }

      userId = loggedInUser._id;

      navigate("/app", {
        state: {
          name: name,
          email: email,
          role: role,
          userId: userId,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
      return;
    }
  };

  return (
    <div className="space-y-6">
      <Typography
        component="h1"
        variant="h5"
        align="center"
        sx={{
          color: colors.brown500,
          marginBottom: 4,
          fontWeight: "extrabold",
        }}
      >
        Login
      </Typography>

      <div>
        <TextField
          className="text-sm font-medium text-brown-500 mb-1 w-full px-4 py-3 rounded-lg bg-beige-50 focus:outline-none"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.5rem",
              backgroundColor: colors.beige50,
              "& fieldset": {
                borderColor: colors.beige300,
              },
              "&:hover fieldset": {
                borderColor: colors.brown500,
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.brown500,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: colors.brown500,
            },
          }}
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
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
        />
      </div>
      <div>
        <TextField
          className="text-sm font-medium text-brown-500 mb-1 w-full px-4 py-3 rounded-lg bg-beige-50 focus:outline-none"
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
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.5rem",
              backgroundColor: colors.beige50,
              "& fieldset": {
                borderColor: colors.beige300,
              },
              "&:hover fieldset": {
                borderColor: colors.brown500,
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.brown500,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: colors.brown500,
            },
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin(e);
            }
          }}
        />
      </div>
      {/* <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Checkbox
            sx={{
              color: colors.brown400,
              "&.Mui-checked": {
                color: colors.brown500,
              },
            }}
          />
          <Typography variant="body2" sx={{ color: colors.brown500 }}>
            Remember me
          </Typography>
        </div>
        <Link
          to="#"
          className="text-sm font-medium text-brown-500 hover:text-brown-700"
        >
          Forgot password?
        </Link>
      </div> */}
      <Button
        onClick={handleLogin}
        sx={{
          width: "100%",
          backgroundColor: colors.brown500,
          color: "white",
          paddingY: 1.5,
          paddingX: 3,
          borderRadius: "0.5rem",
          fontWeight: "medium",
          "&:hover": {
            backgroundColor: colors.brown600,
          },
          "&:focus": {
            outline: "none",
            boxShadow: "0 0 0 2px rgba(168, 85, 247, 0.5)",
          },
        }}
      >
        Login
      </Button>
    </div>
  );
};

export default LoginPage;
