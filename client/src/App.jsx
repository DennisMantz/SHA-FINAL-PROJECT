import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/login";
import Register from './pages/register';
import Homepage from './pages/homepage';
import Card from './pages/card';
import AllCards from './pages/allCards';
import BookmarkManager from './pages/bookmarks';


function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/shareBro/:id" element={<Card/>}/>
          {/* Protected route */}
        <Route
            path="/Cards"
            element={
              <ProtectedRoute>
                <AllCards />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/bookmarks" element={<BookmarkManager />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
