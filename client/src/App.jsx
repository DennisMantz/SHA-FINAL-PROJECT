import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import Login from "./pages/login";
import Register from './pages/register';
import Homepage from './pages/homepage';


function App() {


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/homepage" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
