import Analyze from "./pages/Analyze";
import History from "./pages/History";
function App() {
  return <Analyze />;
}
<Route path="/history" element={<History />} />
export default App;