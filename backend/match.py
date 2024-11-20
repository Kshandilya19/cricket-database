from flask import Blueprint, request, jsonify
import mysql.connector

# Define the blueprint for match-related routes
match_app = Blueprint('match', __name__)

# Database connection function
def db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="pass123",  # Replace with your MySQL root password
        database="cricketdb"    # Ensure the database is 'cricketdb'
    )

# ---------- Create Operations ----------

# Add a match
@match_app.route('/add_match', methods=['POST'])
def add_match():
    try:
        data = request.json
        match_id = data.get('Match_ID')  # Check if Match_ID is passed
        match_date = data['Match_Date']
        tournament_id = data['Tournament_ID']
        team1_id = data['Team1_ID']
        team2_id = data['Team2_ID']
        winner = data['Winner']
        stage = data['Stage']

        # Check if Match_ID is provided, if not, log an error
        if not match_id:
            print("Error: Match_ID is missing!")
            return jsonify({"error": "Match_ID is required"}), 400

        conn = db_connection()
        cursor = conn.cursor()
        query = """
        INSERT INTO cricket_match (Match_ID, Match_Date, Tournament_ID, Team1_ID, Team2_ID, Winner, Stage)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (match_id, match_date, tournament_id, team1_id, team2_id, winner, stage))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Match added successfully!"}), 201

    except Exception as e:
        print("Error occurred while adding match:", str(e))  # Log the error
        return jsonify({"error": str(e)}), 500


# ---------- Read Operations ----------

# Get match names
@match_app.route('/match_names', methods=['GET'])
def get_match_names():
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        # Query to fetch all necessary columns from the `cricket_match` table
        query = """
        SELECT Match_ID, Match_Date, Tournament_ID, Team1_ID, Team2_ID, Winner, Stage
        FROM cricket_match
        """
        cursor.execute(query)
        matches = cursor.fetchall()

        cursor.close()
        conn.close()

        # Format the Match_Date as per your requirement, if needed (e.g., convert to string)
        for match in matches:
            match['Match_Date'] = match['Match_Date'].strftime('%Y-%m-%d')  # Format date if necessary

        return jsonify(matches), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- Delete Operations ----------

# Delete a match
@match_app.route('/delete_match/<int:match_id>', methods=['DELETE'])
def delete_match(match_id):
    try:
        conn = db_connection()
        cursor = conn.cursor()

        query = "DELETE FROM cricket_match WHERE Match_ID = %s"
        cursor.execute(query, (match_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Match deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get matches by team ID
@match_app.route('/matches_by_team/<int:team_id>', methods=['GET'])
def get_matches_by_team(team_id):
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT cm.Match_ID, cm.Match_Date, t1.Team_Name AS Team1, t2.Team_Name AS Team2
        FROM cricket_match cm
        JOIN team t1 ON cm.Team1_ID = t1.Team_ID
        JOIN team t2 ON cm.Team2_ID = t2.Team_ID
        WHERE t1.Team_ID = %s OR t2.Team_ID = %s
        """
        cursor.execute(query, (team_id, team_id))
        matches = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(matches), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
