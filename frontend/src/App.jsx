import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Analyze from "./pages/Analyze";
import History from "./pages/History";


function App() {

  return (

    <BrowserRouter>

      <div
        style={{
          minHeight: "100vh",
          fontFamily: "Arial, sans-serif",
          background: "#f8fafc"
        }}
      >

        {/* NAVBAR */}

        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 40px",
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            position: "sticky",
            top: 0,
            zIndex: 100
          }}
        >

          <Link
            to="/"
            style={{
              textDecoration: "none",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#111827"
            }}
          >
            SkillGap AI
          </Link>


          <div
            style={{
              display: "flex",
              gap: "25px"
            }}
          >

            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#374151",
                fontWeight: "500"
              }}
            >
              Analyze
            </Link>


            <Link
              to="/history"
              style={{
                textDecoration: "none",
                color: "#374151",
                fontWeight: "500"
              }}
            >
              Analysis History
            </Link>

          </div>

        </nav>


        {/* PAGES */}

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

      </div>

    </BrowserRouter>

  );

}


export default App;