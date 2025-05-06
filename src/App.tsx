import { Routes, Route } from "react-router";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/CorrectionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
