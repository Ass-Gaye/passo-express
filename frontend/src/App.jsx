import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Fares from "./pages/Fares";
import CreateFare from "./pages/CreateFare";
import Localities from "./pages/Localities";

const App = () => {

  return (

    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fares" element={<Fares />} />
        <Route path="/create-fare" element={<CreateFare />} />
        <Route path="/localities" element={<Localities />} />
      </Routes>

    </BrowserRouter>

  )
}

export default App