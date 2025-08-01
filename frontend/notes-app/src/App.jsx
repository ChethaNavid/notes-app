import React from 'react'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './pages/Home/Home'
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';

const route = (
  <Router>
    <Routes>
      <Route path='/dashboard' element={<Home />} />
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
  </Router>
)

const App = () => {
  return (
    <div>
      {route}
    </div>
  )
}

export default App