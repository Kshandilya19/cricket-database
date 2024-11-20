import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Matches() {
    const [matches, setMatches] = useState([]);
    const [newMatch, setNewMatch] = useState({
        Match_ID: '', // Added Match_ID
        Match_Date: '',
        Tournament_ID: '',
        Team1_ID: '',
        Team2_ID: '',
        Winner: '',
        Stage: ''
    });
    const [teamId, setTeamId] = useState('');
    const [teamMatches, setTeamMatches] = useState([]);
    const [matchToDelete, setMatchToDelete] = useState('');

    // Fetch all matches
    const fetchMatchNames = async () => {
        try {
            const response = await axios.get('http://localhost:5000/match/match_names');
            setMatches(response.data);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    // Add a new match
    const addMatch = async (e) => {
        e.preventDefault();
        try {
            // Make sure Match_ID is provided
            if (!newMatch.Match_ID) {
                alert("Match ID is required");
                return;
            }

            await axios.post('http://localhost:5000/match/add_match', newMatch);
            setNewMatch({
                Match_ID: '', // Resetting after successful submission
                Match_Date: '',
                Tournament_ID: '',
                Team1_ID: '',
                Team2_ID: '',
                Winner: '',
                Stage: ''
            });
            await fetchMatchNames(); // Refresh matches after adding
        } catch (error) {
            console.error('Error adding match:', error);
        }
    };

    // Delete a match
    const deleteMatch = async () => {
        try {
            await axios.delete(`http://localhost:5000/match/delete_match/${matchToDelete}`);
            setMatchToDelete('');
            await fetchMatchNames(); // Refresh matches after deletion
        } catch (error) {
            console.error('Error deleting match:', error);
        }
    };

    // Fetch matches by team ID
    const fetchMatchesByTeam = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/match/matches_by_team/${teamId}`);
            setTeamMatches(response.data);
        } catch (error) {
            console.error('Error fetching matches by team:', error);
        }
    };

    useEffect(() => {
        fetchMatchNames(); // Initial load of matches
    }, []);

    return (
        <div>
            <h1>Matches Management</h1>

            {/* Add Match */}
            <form onSubmit={addMatch}>
                <h2>Add Match</h2>
                <input
                    type="number"
                    placeholder="Match ID"
                    value={newMatch.Match_ID}
                    onChange={(e) => setNewMatch({ ...newMatch, Match_ID: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Match Date"
                    value={newMatch.Match_Date}
                    onChange={(e) => setNewMatch({ ...newMatch, Match_Date: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Tournament ID"
                    value={newMatch.Tournament_ID}
                    onChange={(e) => setNewMatch({ ...newMatch, Tournament_ID: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Team 1 ID"
                    value={newMatch.Team1_ID}
                    onChange={(e) => setNewMatch({ ...newMatch, Team1_ID: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Team 2 ID"
                    value={newMatch.Team2_ID}
                    onChange={(e) => setNewMatch({ ...newMatch, Team2_ID: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Winner"
                    value={newMatch.Winner}
                    onChange={(e) => setNewMatch({ ...newMatch, Winner: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Stage"
                    value={newMatch.Stage}
                    onChange={(e) => setNewMatch({ ...newMatch, Stage: e.target.value })}
                />
                <button type="submit">Add Match</button>
            </form>

            {/* Match List */}
            <h2>All Matches</h2>
            <table>
                <thead>
                    <tr>
                        <th>Match ID</th>
                        <th>Match Date</th>
                        <th>Tournament ID</th>
                        <th>Team 1 ID</th>
                        <th>Team 2 ID</th>
                        <th>Winner</th>
                        <th>Stage</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((match) => (
                        <tr key={match.Match_ID}>
                            <td>{match.Match_ID}</td>
                            <td>{match.Match_Date}</td>
                            <td>{match.Tournament_ID}</td>
                            <td>{match.Team1_ID}</td>
                            <td>{match.Team2_ID}</td>
                            <td>{match.Winner}</td>
                            <td>{match.Stage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete Match */}
            <h2>Delete Match</h2>
            <input
                type="number"
                value={matchToDelete}
                onChange={(e) => setMatchToDelete(e.target.value)}
                placeholder="Match ID to delete"
            />
            <button onClick={deleteMatch}>Delete Match</button>

            {/* Matches by Team */}
            <h2>Matches by Team</h2>
            <input
                type="number"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="Enter Team ID"
            />
            <button onClick={fetchMatchesByTeam}>Get Matches</button>
            <table>
                <thead>
                    <tr>
                        <th>Match ID</th>
                        <th>Match Date</th>
                        <th>Team 1</th>
                        <th>Team 2</th>
                    </tr>
                </thead>
                <tbody>
                    {teamMatches.map((match) => (
                        <tr key={match.Match_ID}>
                            <td>{match.Match_ID}</td>
                            <td>{match.Match_Date}</td>
                            <td>{match.Team1}</td>
                            <td>{match.Team2}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Matches;
