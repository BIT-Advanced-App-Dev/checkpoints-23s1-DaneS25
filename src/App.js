import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Home from "./TaskManager/TaskManager"

const App = () => {

  return (
      <div className='app'>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/reset" element={<Reset />} />
            <Route exact path="/home" element={<Home />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;
