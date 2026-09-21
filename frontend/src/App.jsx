import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Analyze from "./pages/Analyze";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>

      <nav
        style={{
          padding: "15px 30px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "20px"
        }}
      >
        <Link to="/">
          Analyze
        </Link>

        <Link to="/history">
          Analysis History
        </Link>
      </nav>

      <Routes>

        <Route
          path="/"
          element={<Analyze />}
        />

        <Route
          path="/history"
          element={<History />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;