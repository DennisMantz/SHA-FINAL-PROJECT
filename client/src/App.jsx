import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import Login from "./pages/login";
import Register from './pages/register';
import Homepage from './pages/homepage';
import Card from './pages/card';

function App() {


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/businessCard" element={<Card/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
