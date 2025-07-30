import { useState } from "react";
import { useNavigate } from "react-router";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { colors } from "../../utils/Constants";
import axios from "axios";
import { APIEndpoints } from "../../api/api";
import type { PatientEO, PharmacyEO, ProviderEO } from "../../utils/Interfaces";
import {
  getEmailSuffix,
  validateEmail,
  validateFirstName,
  validateLastName,
  validateMobile,
  validatePassword,
} from "../../utils/Validations";

const Role = {
  patient: "Patient",
  provider: "Doctor",
  pharmacy: "Pharmacy",
};

const SignupPage: React.FC = () => {
  const [role, setRole] = useState(Role.patient);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    contact: {
      email: "",
      phone: "",
    },
    password: "",
  });

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email" || name === "phone") {
      setUser((prevUser) => ({
        ...prevUser,
        contact: {
          ...prevUser.contact,
          [name]: value,
        },
      }));
      if (name === "email")
        setEmailError(validateEmail(value + getEmailSuffix(role), role));
      if (name === "phone") setPhoneError(validateMobile(value));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
      if (name === "firstName") setFirstNameError(validateFirstName(value));
      if (name === "lastName") setLastNameError(validateLastName(value));
      if (name === "password") setPasswordError(validatePassword(value));
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    const fnValidation = validateFirstName(user.firstName);
    const lnValidation = validateLastName(user.lastName);
    const mobileValidation = validateMobile(user.contact.phone);
    const emailValidation = validateEmail(
      user.contact.email + getEmailSuffix(role),
      role
    );
    const passwordValidation = validatePassword(user.password);

    setFirstNameError(fnValidation);
    setLastNameError(lnValidation);
    setPhoneError(mobileValidation);
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (
      fnValidation ||
      lnValidation ||
      mobileValidation ||
      emailValidation ||
      passwordValidation
    ) {
      return;
    }

    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      contact: {
        email: user.contact.email + getEmailSuffix(role),
        phone: user.contact.phone,
      },
      password: user.password,
    };

    try {
      const response = await axios.post<PatientEO | ProviderEO | PharmacyEO>(
        `${APIEndpoints.SignUp}`,
        payload
      );

      const signedUpUser = response.data;
      if (!signedUpUser) {
        console.error("Failed to sign up");
        return;
      }

      const userName: string =
        role === Role.pharmacy
          ? user.firstName
          : `${user.firstName} ${user.lastName}`;

      navigate("/app", {
        state: {
          name: userName,
          email: signedUpUser.contact?.email,
          role,
          userId: signedUpUser._id,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSignup} className="space-y-6">
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
        Sign Up
      </Typography>
      <div>
        <Typography className="block text-sm font-medium text-brown-500 mb-3">
          I am :
        </Typography>
        <Box className="grid grid-cols-2 md:grid-cols-3 place-items-center place-content-center px-10 py-5 gap-4">
          <Button
            onClick={() => setRole("Patient")}
            sx={{
              backgroundColor:
                role === "Patient" ? colors.brown600 : colors.brown300,
              minWidth: 100,
              color: "black",
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
            className="flex flex-col"
          >
            <PersonIcon />
            Patient
          </Button>
          <Button
            onClick={() => setRole("Doctor")}
            sx={{
              backgroundColor:
                role === "Doctor" ? colors.brown600 : colors.brown300,
              minWidth: 100,
              color: "black",
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
            className="flex flex-col"
          >
            <LocalHospitalIcon />
            Doctor
          </Button>
          <Button
            onClick={() => setRole("Pharmacy")}
            sx={{
              backgroundColor:
                role === "Pharmacy" ? colors.brown600 : colors.brown300,
              minWidth: 100,
              color: "black",
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
            className="flex flex-col col-span-2 md:col-span-1"
          >
            <VaccinesIcon />
            Pharmacy
          </Button>
        </Box>
      </div>

      <div
        className={`grid grid-cols-1 ${role !== "Pharmacy" ? "sm:grid-cols-2" : ""} gap-4`}
      >
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
            id="firstName"
            label={role === "Pharmacy" ? "Name" : "First Name"}
            name="firstName"
            autoComplete="given-name"
            autoFocus
            value={user.firstName}
            onChange={handleUserChange}
            error={!!firstNameError}
            helperText={firstNameError}
          />
        </div>
        {role !== "Pharmacy" && (
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
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={user.lastName}
              onChange={handleUserChange}
              error={!!lastNameError}
              helperText={lastNameError}
            />
          </div>
        )}
      </div>
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
          onKeyDown={(e) => {
            if (e.key === "@") {
              e.preventDefault();
            }
          }}
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          value={user.contact.email}
          onChange={handleUserChange}
          error={!!emailError}
          helperText={emailError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {getEmailSuffix(role)}
              </InputAdornment>
            ),
          }}
        />
      </div>
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
          id="phone"
          label="Mobile Number"
          name="phone"
          autoComplete="tel"
          value={user.contact.phone}
          onChange={handleUserChange}
          error={!!phoneError}
          helperText={phoneError}
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
          autoComplete="new-password" // Changed to new-password for signup
          value={user.password}
          onChange={handleUserChange}
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
        />
      </div>
      <Button
        type="submit" // Set type to submit for form submission
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
        Create Account
      </Button>
    </Box>
  );
};

export default SignupPage;
