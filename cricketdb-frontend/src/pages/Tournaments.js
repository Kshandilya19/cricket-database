import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Tournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [newTournament, setNewTournament] = useState({
        name: '',
        format: '',
        level: '',
        startDate: '',
        endDate: ''
    });
    const [tournamentId, setTournamentId] = useState('');  // Store the tournament ID to get the winner
    const [winner, setWinner] = useState(null);  // Store the winner's name

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            console.log("Fetching tournaments...");
            const response = await axios.get('http://localhost:5000/tournaments/tournament_names');
            console.log("Response:", response.data);
            setTournaments(response.data);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
        }
    };

    const addTournament = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/tournaments/add_tournament', {
                Tournament_ID: newTournament.id,
                Tournament_Name: newTournament.name,
                Format: newTournament.format,
                Level: newTournament.level,
                Start_Date: newTournament.startDate,
                End_Date: newTournament.endDate
            });
            fetchTournaments();
            setNewTournament({ id: '', name: '', format: '', level: '', startDate: '', endDate: '' });
        } catch (error) {
            console.error('Error adding tournament:', error);
        }
    };

    const fetchWinner = async () => {
        if (!tournamentId) {
            alert("Please enter a tournament ID!");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/tournaments/tournament_winner/${tournamentId}`);
            if (response.data.Team_Name) {
                setWinner(response.data.Team_Name);
            } else {
                setWinner("No winner found for this tournament.");
            }
        } catch (error) {
            console.error('Error fetching winner:', error);
            setWinner("Error fetching winner.");
        }
    };

    // Function to delete a tournament
    const deleteTournament = async (id) => {
        try {
            console.log(`Attempting to delete tournament with ID: ${id}`);
            const response = await axios.delete(`http://localhost:5000/tournaments/delete_tournament/${id}`);
            console.log("Tournament deleted response:", response.data);  // Log successful response
            fetchTournaments();  // Refresh tournaments list after deletion
        } catch (error) {
            // Log different error scenarios
            if (error.response) {
                console.error('Error response from server:', error.response.data);  // Server-side error details
                alert(`Error deleting tournament: ${error.response.data.error || 'Unknown error'}`);
            } else if (error.request) {
                console.error('No response received:', error.request);  // No response from server
                alert('Error: No response from server');
            } else {
                console.error('Error setting up request:', error.message);  // Request setup error
                alert('Error deleting tournament: ' + error.message);
            }
        }
    };

    return (
        <div className="App-content">
            <h2>Tournaments</h2>
            
            {/* Form to add tournament */}
            <form onSubmit={addTournament}>
                <input
                    type="number"
                    placeholder="Tournament ID"
                    value={newTournament.id}
                    onChange={(e) => setNewTournament({ ...newTournament, id: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Tournament Name"
                    value={newTournament.name}
                    onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                    required
                />
                <select
                    value={newTournament.format}
                    onChange={(e) => setNewTournament({ ...newTournament, format: e.target.value })}
                >
                    <option value="">Select Format</option>
                    <option value="T20">T20</option>
                    <option value="ODI">ODI</option>
                    <option value="Test">Test</option>
                </select>
                <select
                    value={newTournament.level}
                    onChange={(e) => setNewTournament({ ...newTournament, level: e.target.value })}
                >
                    <option value="">Select Level</option>
                    <option value="Local">Local</option>
                    <option value="National">National</option>
                    <option value="International">International</option>
                </select>
                <input
                    type="date"
                    value={newTournament.startDate}
                    onChange={(e) => setNewTournament({ ...newTournament, startDate: e.target.value })}
                />
                <input
                    type="date"
                    value={newTournament.endDate}
                    onChange={(e) => setNewTournament({ ...newTournament, endDate: e.target.value })}
                />
                <button type="submit">Add Tournament</button>
            </form>

            {/* Input to get winner */}
            <div>
                <input
                    type="number"
                    placeholder="Enter Tournament ID to get winner"
                    value={tournamentId}
                    onChange={(e) => setTournamentId(e.target.value)}
                />
                <button onClick={fetchWinner}>Get Winner</button>
            </div>

            {winner && (
                <div>
                    <h3>Winner:</h3>
                    <p>{winner}</p>
                </div>
            )}

            {/* Display tournaments */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tournaments.map((tournament) => (
                        <tr key={tournament.Tournament_ID}>
                            <td>{tournament.Tournament_ID}</td>
                            <td>{tournament.Tournament_Name}</td>
                            <td>
                                <button onClick={() => deleteTournament(tournament.Tournament_ID)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Tournaments;