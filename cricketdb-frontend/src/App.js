import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import logo from './logo.jpg';

// Import your pages
import Teams from './pages/Teams';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Tournaments from './pages/Tournaments';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <div className="logo-container">
                        <img src={logo} alt="CricFreak Logo" className="App-logo" />
                        <h1>CRICFREAK</h1>
                    </div>
                    <nav className="App-navbar">
                        <ul>
                            <li><Link to="/teams">Teams</Link></li>
                            <li><Link to="/players">Players</Link></li>
                            <li><Link to="/matches">Matches</Link></li>
                            <li><Link to="/tournaments">Tournaments</Link></li>
                        </ul>
                    </nav>
                    <div className="search-account">
                        <input type="text" placeholder="Search..." className="search-bar" />
                        <button className="login-button">Login</button>
                    </div>
                </header>
                <div className="App-body">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/players" element={<Players />} />
                        <Route path="/matches" element={<Matches />} />
                        <Route path="/tournaments" element={<Tournaments />} />
                    </Routes>
                </div>
                <footer className="App-footer">
                    <p>&copy; 2024 Cricket Stats</p>
                </footer>
            </div>
        </Router>
    );
}

// Home page as a placeholder
function Home() {
    return (
        <main className="App-content">
            <h2>Welcome to Cricket Stats</h2>
            <p>Select a section from the navigation bar to view more details.</p>
        </main>
    );
}

export default App;
