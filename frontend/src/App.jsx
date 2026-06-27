import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateSession from "./pages/CreateSession";
import JoinSession from "./pages/JoinSession";
import Session from "./pages/Session";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/create-session"
          element={<CreateSession />}
        />

        <Route
          path="/join-session"
          element={<JoinSession />}
        />

        <Route
          path="/session/:roomCode"
          element={<Session />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;