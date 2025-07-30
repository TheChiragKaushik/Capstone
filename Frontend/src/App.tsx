import { Route, Routes } from "react-router";
import "./App.css";
import LogonPage from "./pages/LogonPage";
import MainApp from "./pages/MainApp";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/logon" element={<LogonPage />} />
        <Route path="/app" element={<MainApp />} />
      </Routes>
    </>
  );
};

export default App;
