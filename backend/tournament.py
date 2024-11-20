from flask import Blueprint, request, jsonify
import mysql.connector

# Define the Blueprint for Tournament
tournament_app = Blueprint('tournaments', __name__)

# Database connection
def db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="pass123",  # Replace with your MySQL root password
        database="cricketdb"
    )

# ---------- Create Operations ----------

@tournament_app.route('/add_tournament', methods=['POST'])
def add_tournament():
    try:
        data = request.json
        tournament_id = data['Tournament_ID']  # Explicitly provided by the user
        tournament_name = data['Tournament_Name']
        tournament_format = data.get('Format')  # Optional
        level = data.get('Level')  # Optional
        start_date = data.get('Start_Date')  # Optional
        end_date = data.get('End_Date')  # Optional

        conn = db_connection()
        cursor = conn.cursor()

        # Check if Tournament_ID already exists
        check_query = "SELECT COUNT(*) FROM Tournament WHERE Tournament_ID = %s"
        cursor.execute(check_query, (tournament_id,))
        if cursor.fetchone()[0] > 0:
            return jsonify({"error": "Tournament_ID already exists!"}), 400

        query = """
        INSERT INTO Tournament (Tournament_ID, Tournament_Name, Format, Level, Start_Date, End_Date) 
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (tournament_id, tournament_name, tournament_format, level, start_date, end_date))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Tournament added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- Read Operations ----------

# Get tournament names
@tournament_app.route('/tournament_names', methods=['GET'])
def get_tournament_names():
    try:
        print("Received request for tournament names")
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT Tournament_ID, Tournament_Name FROM Tournament"
        cursor.execute(query)
        tournaments = cursor.fetchall()

        cursor.close()
        conn.close()

        print("Fetched tournaments:", tournaments)
        return jsonify(tournaments), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

# ---------- Delete Operations ----------

# Delete a tournament
@tournament_app.route('/delete_tournament/<int:tournament_id>', methods=['DELETE'])
def delete_tournament(tournament_id):
    try:
        conn = db_connection()
        cursor = conn.cursor()

        query = "DELETE FROM Tournament WHERE Tournament_ID = %s"
        cursor.execute(query, (tournament_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Tournament deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error":str(e)}),500
# ---------- Additional Read Operation ----------

# Get the winner of a specific tournament
@tournament_app.route('/tournament_winner/<int:tournament_id>', methods=['GET'])
def get_tournament_winner(tournament_id):
    try:
        conn = db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT Team_Name
        FROM Team
        WHERE Team_ID = (
            SELECT Winner
            FROM Cricket_Match
            WHERE Tournament_ID = %s AND Winner IS NOT NULL
            LIMIT 1
        )
        """
        cursor.execute(query, (tournament_id,))
        winner = cursor.fetchone()

        cursor.close()
        conn.close()

        if winner:
            return jsonify(winner), 200
        else:
            return jsonify({"message": "No winner found for this tournament."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500