import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Players() {
    const [players, setPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState({
        Player_ID: '', // Added Player_ID here
        Player_Name: '',
        Gender: '',
        Role: '',
        DOB: '',
        Team_ID: ''
    });
    const [playerIdToDelete, setPlayerIdToDelete] = useState('');
    const [playerToUpdate, setPlayerToUpdate] = useState({
        Player_ID: '',
        Player_Name: '',
        Role: ''
    });
    const [totalRuns, setTotalRuns] = useState(null);
    const [playerIdForRuns, setPlayerIdForRuns] = useState('');

    // Fetch all players
    const fetchPlayers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/player/all_players');
            setPlayers(response.data);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    // Fetch total runs for a player
    const fetchTotalRuns = async (playerId) => {
        try {
            // Use the playerId variable in the URL to fetch the total runs
            const response = await axios.get(`http://localhost:5000/player/total_runs/${playerId}`);
            console.log(response); // Debugging line to see the response
    
            if (response.data.message) {
                alert(response.data.message); // Show error message from backend
                setTotalRuns(null);
            } else {
                setTotalRuns(response.data.Total_Runs);
            }
        } catch (error) {
            console.error('Error fetching total runs:', error);
            setTotalRuns(null);
        }
    };

    // Add a new player
    const addPlayer = async (e) => {
        e.preventDefault();
        try {
            if (!newPlayer.Player_ID || !newPlayer.Player_Name || !newPlayer.Gender || !newPlayer.Role || !newPlayer.DOB || !newPlayer.Team_ID) {
                alert('All fields are required');
                return;
            }
    
            // Send the POST request to the backend
            await axios.post('http://localhost:5000/player/add_player', newPlayer);
            setNewPlayer({
                Player_ID: '', // Reset Player_ID
                Player_Name: '',
                Gender: '',
                Role: '',
                DOB: '',
                Team_ID: ''
            });
            fetchPlayers(); // Refresh player list after adding
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Check for 400 error and display the custom message
                alert(error.response.data.error || 'Error adding player');
            } else {
                // Handle other errors
                console.error('Error adding player:', error);
            }
        }
    };

    // Delete a player
    const deletePlayer = async () => {
        try {
            if (!playerIdToDelete) {
                alert('Please enter a valid Player ID');
                return;
            }

            await axios.delete(`http://localhost:5000/player/delete_player/${playerIdToDelete}`);
            setPlayerIdToDelete('');
            fetchPlayers(); // Refresh player list after deletion
        } catch (error) {
            console.error('Error deleting player:', error);
        }
    };

    // Update player details
    const updatePlayer = async (e) => {
        e.preventDefault();
        try {
            if (!playerToUpdate.Player_ID || !playerToUpdate.Player_Name || !playerToUpdate.Role) {
                alert('All fields are required');
                return;
            }

            await axios.put('http://localhost:5000/player/update_player', playerToUpdate);
            setPlayerToUpdate({
                Player_ID: '',
                Player_Name: '',
                Role: ''
            });
            fetchPlayers(); // Refresh player list after update
        } catch (error) {
            console.error('Error updating player:', error);
        }
    };

    useEffect(() => {
        fetchPlayers(); // Initial load of players
    }, []);

    return (
        <div>
            <h1>Players Management</h1>

            {/* Add Player */}
            <form onSubmit={addPlayer}>
                <h2>Add Player</h2>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Player ID"
                        value={newPlayer.Player_ID}
                        onChange={(e) => setNewPlayer({ ...newPlayer, Player_ID: e.target.value })}
                        style={{ padding: '6px', width: '200px', marginBottom: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Player Name"
                        value={newPlayer.Player_Name}
                        onChange={(e) => setNewPlayer({ ...newPlayer, Player_Name: e.target.value })}
                        style={{ padding: '6px', width: '200px', marginBottom: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Gender (M/F/O)"
                        value={newPlayer.Gender}
                        onChange={(e) => setNewPlayer({ ...newPlayer, Gender: e.target.value })}
                        style={{ padding: '6px', width: '200px', marginBottom: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Role"
                        value={newPlayer.Role}
                        onChange={(e) => setNewPlayer({ ...newPlayer, Role: e.target.value })}
                        style={{ padding: '6px', width: '200px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="date"
                        value={newPlayer.DOB}
                        onChange={(e) => setNewPlayer({ ...newPlayer, DOB: e.target.value })}
                        style={{ padding: '6px', width: '200px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Team ID"
                        value={newPlayer.Team_ID}
                        onChange={(e) => setNewPlayer({ ...newPlayer, Team_ID: e.target.value })}
                        style={{ padding: '6px', width: '200px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Add Player</button>
            </form>

            {/* Update Player */}
            <form onSubmit={updatePlayer}>
                <h2>Update Player</h2>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Player ID"
                        value={playerToUpdate.Player_ID}
                        onChange={(e) => setPlayerToUpdate({ ...playerToUpdate, Player_ID: e.target.value })}
                        style={{ padding: '6px', width: '200px', marginBottom: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Player Name"
                        value={playerToUpdate.Player_Name}
                        onChange={(e) => setPlayerToUpdate({ ...playerToUpdate, Player_Name: e.target.value })}
                        style={{ padding: '6px', width: '200px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Role"
                        value={playerToUpdate.Role}
                        onChange={(e) => setPlayerToUpdate({ ...playerToUpdate, Role: e.target.value })}
                        style={{ padding: '6px', width: '200px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Update Player</button>
            </form>

            {/* Delete Player */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Delete Player</h2>
                <input
                    type="text"
                    placeholder="Player ID to delete"
                    value={playerIdToDelete}
                    onChange={(e) => setPlayerIdToDelete(e.target.value)}
                    style={{ padding: '6px', marginBottom: '10px', width: '200px' }}
                />
                <button onClick={deletePlayer} style={{ padding: '8px 16px', cursor: 'pointer' }}>Delete Player</button>
            </div>

            {/* Fetch Total Runs */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Get Total Runs</h2>
                <input
                    type="text"
                    placeholder="Player ID"
                    value={playerIdForRuns}
                    onChange={(e) => setPlayerIdForRuns(e.target.value)}
                    style={{ padding: '6px', marginBottom: '10px', width: '200px' }}
                />
                <button
                    onClick={() => fetchTotalRuns(playerIdForRuns)}
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                >
                    Get Total Runs
                </button>

                {/* Display Total Runs */}
                {totalRuns !== null && (
                    <div style={{ marginTop: '10px' }}>
                        <h4>Total Runs: {totalRuns}</h4>
                    </div>
                )}
            </div>

            {/* Display Players */}
            <h2>Players List</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Role</th>
                        <th>DOB</th>
                        <th>Team ID</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => (
                        <tr key={player.Player_ID}>
                            <td>{player.Player_ID}</td>
                            <td>{player.Player_Name}</td>
                            <td>{player.Gender}</td>
                            <td>{player.Role}</td>
                            <td>{player.DOB}</td>
                            <td>{player.Team_ID}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Players;
