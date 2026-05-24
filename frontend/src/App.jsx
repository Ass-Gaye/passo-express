import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Fares from "./pages/Fares";
import CreateFare from "./pages/CreateFare";
import Localities from "./pages/Localities";

import EditFare from './pages/EditFare'
import Dashboard from './pages/Dashboard'

const App = () => {

  return (

    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fares" element={<Fares />} />
        <Route path="/create-fare" element={<CreateFare />} />
        <Route path="/edit-fare/:id" element={<EditFare />}/>
        <Route path="/localities" element={<Localities />} />
        <Route path="/dashboard" element={<Dashboard />}/>
      </Routes>

    </BrowserRouter>

  )
}

export default App