import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import Login from "./pages/login";
import Register from './pages/register';
import Homepage from './pages/homepage';
import Card from './pages/card';
import AllCards from './pages/allCards';
import BookmarkManager from './pages/bookmarks';

function App() {


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/shareBro/:id" element={<Card/>}/>
          <Route path="/Cards" element={<AllCards />} /> {/* List all cards */}
          <Route path="/bookmarks" element={<BookmarkManager />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
