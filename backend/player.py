from flask import Blueprint, request, jsonify
import mysql.connector
from mysql.connector import Error

# Define the blueprint for player-related routes
player_app = Blueprint('player', __name__)

# Database connection
def db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="pass123",  # Replace with your MySQL root password
        database="cricketdb"
    )

# ---------- Read Operations ----------

# Get all players details
@player_app.route('/all_players', methods=['GET'])
def get_all_players():
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM player"  # Retrieve all columns from Players table
        cursor.execute(query)
        players = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(players), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get player names
@player_app.route('/player_names', methods=['GET'])
def get_player_names():
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT Player_ID, Player_Name FROM player"
        cursor.execute(query)
        players = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(players), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- Create Operations ----------

# Add a player
@player_app.route('/add_player', methods=['POST'])
def add_player():
    try:
        data = request.json
        player_id = data.get('Player_ID')  # Fetch Player_ID from the request

        # Ensure Player_ID is provided
        if not player_id:
            return jsonify({"error": "Player_ID is required"}), 400

        name = data['Player_Name']
        gender = data['Gender']
        role = data['Role']
        dob = data['DOB']
        team_id = data['Team_ID']

        # Connect to the database
        conn = db_connection()
        cursor = conn.cursor()

        # Insert player details into the database
        query = "INSERT INTO player (Player_ID, Player_Name, Gender, Role, DOB, Team_ID) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (player_id, name, gender, role, dob, team_id))

        # Commit changes and close connection
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Player added successfully!"}), 201

    except Error as e:
        # Handle MySQL-specific errors (including those triggered by the trigger)
        return jsonify({"error": f"MySQL error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- Update Operations ----------

# Update player details
@player_app.route('/update_player', methods=['PUT'])
def update_player():
    try:
        data = request.json
        player_id = data['Player_ID']
        name = data.get('Player_Name', None)
        role = data.get('Role', None)

        conn = db_connection()
        cursor = conn.cursor()

        query = "UPDATE player SET Player_Name = %s, Role = %s WHERE Player_ID = %s"
        cursor.execute(query, (name, role, player_id))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Player updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- Delete Operations ----------

# Delete a player
@player_app.route('/delete_player/<int:player_id>', methods=['DELETE'])
def delete_player(player_id):
    try:
        conn = db_connection()
        cursor = conn.cursor()

        query = "DELETE FROM player WHERE Player_ID = %s"
        cursor.execute(query, (player_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Player deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get total runs for a player
@player_app.route('/total_runs/<int:player_id>', methods=['GET'])
def get_total_runs(player_id):
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        # Query to fetch the total runs of a player
        query = """
        SELECT Player_ID, SUM(IFNULL(Runs_Scored, 0)) AS Total_Runs
        FROM Batting_Stats
        WHERE Player_ID = %s
        GROUP BY Player_ID
        """
        cursor.execute(query, (player_id,))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if result and result['Total_Runs'] is not None:
            return jsonify(result), 200
        else:
            return jsonify({"message": "No stats found for this player."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500



