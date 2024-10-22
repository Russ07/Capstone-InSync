import './App.css';
import "./styles/global.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Dashboard from './Pages/Dashboard/Dashboard';
import Concerts from './Pages/Concerts/Concerts';
// import RecommendedPlaylists from './Pages/Playlist/Playlist';
import Playlist from './Pages/Playlist/Playlist';
import Authorisation from './Pages/Authorisation/Authorisation';

function App() {
  return (
    <Router>
      <main className="App">
        <Header />
         <Routes>
          <Route path='/' element={<Authorisation />} />
          <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/concerts" element={<Concerts />} />
           <Route path="/recommended-playlists" element={<Playlist />} /> 
        </Routes> 
        <Footer />
      </main>
    </Router>
  );
}

export default App;
