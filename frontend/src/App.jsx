import { BrowserRouter, Routes, Route } from "react-router-dom";

import Analyze from "./pages/Analyze";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
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