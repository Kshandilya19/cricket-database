from flask import Flask, jsonify
from player import player_app
from tournament import tournament_app
from match import match_app
from team import team_app
from flask_cors import CORS

app = Flask(__name__)

# Apply CORS globally
CORS(app)

# Register blueprints for each module (Player, Tournament, Match, Team)
app.register_blueprint(player_app, url_prefix='/player')
app.register_blueprint(tournament_app, url_prefix='/tournaments')
app.register_blueprint(match_app, url_prefix='/match')
app.register_blueprint(team_app, url_prefix='/team')

# Route to check if the server is running
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Cricket DBMS API!"}), 200

if __name__ == '__main__':
    app.run(debug=True)
