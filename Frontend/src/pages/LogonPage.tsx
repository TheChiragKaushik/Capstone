import { useState } from "react";
import LoginPage from "../components/Logon/LoginPage";
import SignupPage from "../components/Logon/SignupPage";
import { Box, Paper } from "@mui/material";
import Intro from "../components/Logon/Intro";

const LogonPage = () => {
  const [logonType, setLogonType] = useState("login");

  return (
    <>
      <Box className="flex min-h-screen my-auto items-center justify-center p-4 md:p-8">
        <Paper className="w-full max-w-4xl flex flex-col md:flex-row rounded-xl overflow-hidden form-container bg-white">
          <Intro />
          <Box className="w-full md:w-7/12 p-8">
            {logonType === "login" ? (
              <>
                <LoginPage />
                <p className="flex items-center justify-center mt-5 text-brown-300">
                  Don&apos;t have an account?&nbsp;
                  <span
                    onClick={() => setLogonType("signup")}
                    className="text-brown-500 underline cursor-pointer"
                  >
                    Sign In
                  </span>
                </p>
              </>
            ) : logonType === "signup" ? (
              <>
                <SignupPage />
                <p className="flex items-center justify-center mt-5 text-brown-300">
                  Have an account?&nbsp;
                  <span
                    onClick={() => setLogonType("login")}
                    className="text-brown-500 underline cursor-pointer"
                  >
                    Login
                  </span>
                </p>
              </>
            ) : null}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default LogonPage;
