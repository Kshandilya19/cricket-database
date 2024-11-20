from flask import Flask, jsonify, Blueprint, request
import mysql.connector
from flask_cors import CORS

# Database connection
def db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="pass123",  # Replace with your MySQL root password
        database="cricketdb"
    )

# Define the blueprint for team-related routes
team_app = Blueprint('team', __name__)

# ---------- Create Operations ----------

# Add a team
@team_app.route('/add_team', methods=['POST'])
def add_team():
    try:
        data = request.json
        team_id = data['Team_ID']
        team_name = data['Team_Name']
        team_type = data.get('Team_Type')
        captain_id = data.get('Captain_ID')  

        conn = db_connection()
        cursor = conn.cursor()

        # Insert query that includes Team_Type and Captain_ID if provided
        query = """
        INSERT INTO team (Team_ID, Team_Name, Team_Type, Captain_ID)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (team_id, team_name, team_type, captain_id if captain_id else None))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Team added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- Read Operations ----------

# Get team names along with their type and captain
@team_app.route('/team_names', methods=['GET'])
def get_team_names():
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT Team_ID, Team_Name, Team_Type, Captain_ID
        FROM team
        """
        cursor.execute(query)
        teams = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(teams), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get details of a specific team by ID
@team_app.route('/team/<int:team_id>', methods=['GET'])
def get_team_by_id(team_id):
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT Team_ID, Team_Name, Team_Type, Captain_ID
        FROM team
        WHERE Team_ID = %s
        """
        cursor.execute(query, (team_id,))
        team = cursor.fetchone()

        cursor.close()
        conn.close()

        if team:
            return jsonify(team), 200
        else:
            return jsonify({"message": "Team not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- Update Operations ----------

# Update a team's details (e.g., name, type, captain)
@team_app.route('/update_team', methods=['PUT'])
def update_team():
    try:
        data = request.json
        team_id = data['Team_ID']
        team_name = data.get('Team_Name', None)
        team_type = data.get('Team_Type', None)
        captain_id = data.get('Captain_ID', None)

        conn = db_connection()
        cursor = conn.cursor()

        # Only update the values that are provided
        query = """
        UPDATE team
        SET Team_Name = %s, Team_Type = %s, Captain_ID = %s
        WHERE Team_ID = %s
        """
        cursor.execute(query, (team_name, team_type, captain_id, team_id))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Team updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- Delete Operations ----------

# Delete a team
@team_app.route('/delete_team/<int:team_id>', methods=['DELETE'])
def delete_team(team_id):
    try:
        conn = db_connection()
        cursor = conn.cursor()

        query = "DELETE FROM team WHERE Team_ID = %s"
        cursor.execute(query, (team_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Team deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- Get Captains ----------
@team_app.route('/captains', methods=['GET'])
def get_captains():
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        # Assuming you have a 'captain' table or field for captains
        query = "SELECT Captain_ID, Captain_Name FROM captain"  # Adjust the query based on your schema
        cursor.execute(query)
        captains = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(captains), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@team_app.route('/get_team_stats', methods=['POST'])
def get_team_stats():
    try:
        team_id = request.json['team_id']
        
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        # Call the stored procedure
        cursor.callproc('GetTeamStats', [team_id])

        # Fetch results from the procedure
        team_stats = []
        for result in cursor.stored_results():
            stats = result.fetchall()
            if stats:
                # Format stats as key-value pairs for the frontend
                for stat in stats:
                    team_stats.append({
                        'stat_name': 'Team Name',
                        'value': stat['Team_Name']
                    })
                    team_stats.append({
                        'stat_name': 'Player Count',
                        'value': stat['Player_Count']
                    })
                    team_stats.append({
                        'stat_name': 'Matches Played',
                        'value': stat['Matches_Played']
                    })

        cursor.close()
        conn.close()

        if team_stats:
            return jsonify(team_stats), 200
        else:
            return jsonify({"message": "No stats found for this team."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
