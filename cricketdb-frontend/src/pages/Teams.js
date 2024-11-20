import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Teams() {
    const [teams, setTeams] = useState([]);
    const [newTeam, setNewTeam] = useState({
        Team_ID: '',
        Team_Name: '',
        Team_Type: '',
        Captain_ID: ''
    });
    const [teamIdToDelete, setTeamIdToDelete] = useState('');
    const [teamToUpdate, setTeamToUpdate] = useState({
        Team_ID: '',
        Team_Name: '',
        Team_Type: '',
        Captain_ID: ''
    });
    const [teamIdForStats, setTeamIdForStats] = useState(''); // State for team ID input
    const [teamStats, setTeamStats] = useState(null); // State to hold the fetched stats

    // Fetch all teams
    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://localhost:5000/team/team_names');
            setTeams(response.data);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    // Add a new team
    const addTeam = async (e) => {
        e.preventDefault();
        try {
            if (!newTeam.Team_ID || !newTeam.Team_Name || !newTeam.Team_Type) {
                alert('Team ID, Name, and Type are required');
                return;
            }

            await axios.post('http://localhost:5000/team/add_team', newTeam);
            setNewTeam({
                Team_ID: '',
                Team_Name: '',
                Team_Type: '',
                Captain_ID: ''
            });
            fetchTeams();
        } catch (error) {
            console.error('Error adding team:', error);
        }
    };

    // Delete a team
    const deleteTeam = async () => {
        try {
            if (!teamIdToDelete) {
                alert('Please enter a valid Team ID');
                return;
            }

            await axios.delete(`http://localhost:5000/team/delete_team/${teamIdToDelete}`);
            setTeamIdToDelete('');
            fetchTeams();
        } catch (error) {
            console.error('Error deleting team:', error);
        }
    };

    // Update team details
    const updateTeam = async (e) => {
        e.preventDefault();
        try {
            if (!teamToUpdate.Team_ID || !teamToUpdate.Team_Name || !teamToUpdate.Team_Type) {
                alert('Team ID, Name, and Type are required');
                return;
            }

            await axios.put('http://localhost:5000/team/update_team', teamToUpdate);
            setTeamToUpdate({
                Team_ID: '',
                Team_Name: '',
                Team_Type: '',
                Captain_ID: ''
            });
            fetchTeams();
        } catch (error) {
            console.error('Error updating team:', error);
        }
    };

    // Fetch team stats
    const fetchTeamStats = async () => {
        try {
            if (!teamIdForStats) {
                alert('Please enter a valid Team ID for stats');
                return;
            }

            const response = await axios.post('http://localhost:5000/team/get_team_stats', {
                team_id: teamIdForStats
            });

            if (response.data.length === 0) {
                alert('No stats found for this team');
            } else {
                setTeamStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching team stats:', error);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    return (
        <div>
            <h1>Teams Management</h1>

            {/* Add Team Form */}
            <form onSubmit={addTeam}>
                <h2>Add Team</h2>
                <input
                    type="text"
                    placeholder="Team ID"
                    value={newTeam.Team_ID}
                    onChange={(e) => setNewTeam({ ...newTeam, Team_ID: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Team Name"
                    value={newTeam.Team_Name}
                    onChange={(e) => setNewTeam({ ...newTeam, Team_Name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Team Type (Domestic/International)"
                    value={newTeam.Team_Type}
                    onChange={(e) => setNewTeam({ ...newTeam, Team_Type: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Captain ID (optional)"
                    value={newTeam.Captain_ID}
                    onChange={(e) => setNewTeam({ ...newTeam, Captain_ID: e.target.value })}
                />
                <button type="submit">Add Team</button>
            </form>

            {/* Update Team Form */}
            <form onSubmit={updateTeam}>
                <h2>Update Team</h2>
                <input
                    type="text"
                    placeholder="Team ID"
                    value={teamToUpdate.Team_ID}
                    onChange={(e) => setTeamToUpdate({ ...teamToUpdate, Team_ID: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Team Name"
                    value={teamToUpdate.Team_Name}
                    onChange={(e) => setTeamToUpdate({ ...teamToUpdate, Team_Name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Team Type"
                    value={teamToUpdate.Team_Type}
                    onChange={(e) => setTeamToUpdate({ ...teamToUpdate, Team_Type: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Captain ID (optional)"
                    value={teamToUpdate.Captain_ID}
                    onChange={(e) => setTeamToUpdate({ ...teamToUpdate, Captain_ID: e.target.value })}
                />
                <button type="submit">Update Team</button>
            </form>

            {/* Delete Team */}
            <div>
                <h2>Delete Team</h2>
                <input
                    type="text"
                    placeholder="Team ID to delete"
                    value={teamIdToDelete}
                    onChange={(e) => setTeamIdToDelete(e.target.value)}
                />
                <button onClick={deleteTeam}>Delete Team</button>
            </div>

            {/* Fetch Team Stats */}
            <div>
                <h2>Get Team Stats</h2>
                <input
                    type="text"
                    placeholder="Team ID for stats"
                    value={teamIdForStats}
                    onChange={(e) => setTeamIdForStats(e.target.value)}
                />
                <button onClick={fetchTeamStats}>Fetch Stats</button>
            </div>

            {/* Display Stats */}
            {teamStats && (
    <div>
        <h2>Team Stats</h2>
        <table>
            <thead>
                <tr>
                    <th>Stat</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {teamStats.map((stat, index) => (
                    <tr key={index}>
                        <td>{stat.stat_name}</td>
                        <td>{stat.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}

            {/* Display Teams */}
            <h2>Teams List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Captain</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team) => (
                        <tr key={team.Team_ID}>
                            <td>{team.Team_ID}</td>
                            <td>{team.Team_Name}</td>
                            <td>{team.Team_Type}</td>
                            <td>{team.Captain_ID || 'None'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Teams;
