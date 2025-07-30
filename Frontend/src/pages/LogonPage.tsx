import { useState } from "react";
import LoginPage from "../components/LoginPage";
import SignupPage from "../components/SignupPage";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const LogonPage = () => {
  const [logonType, setLogonType] = useState("login");

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button
          onClick={() =>
            setLogonType(logonType === "login" ? "signup" : "login")
          }
        >
          Login
        </Button>
        <Button
          onClick={() =>
            setLogonType(logonType === "login" ? "signup" : "login")
          }
        >
          Signup
        </Button>
      </Box>
      {logonType === "login" ? <LoginPage /> : <SignupPage />}
    </>
  );
};

export default LogonPage;
