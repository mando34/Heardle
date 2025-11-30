from flask import Blueprint, request, jsonify, send_from_directory
from src.backend.game_logic.heardle_game import HeardleGame
import os

game_bp = Blueprint("game_bp", __name__)


current = os.getcwd()
audio_dir = r"\src\static\audio"
path = os.path.join(current, audio_dir)
 

@game_bp.get("/start")
def start_game():
    game = HeardleGame()
    game.start()   # picks song
    return jsonify({
        "song_url": game.url,
        "filename": game.filename,
        "attempt": 1,
        "snippet_seconds": game.snippet_for_attempt(1),
        "name": game.song,
        "artist": game.artist,
    })


@game_bp.post("/guess")
def guess():
    data = request.get_json()

    filename = data["filename"]
    url = data["song_url"]
    guess_text = data["guess"]
    attempt = int(data["attempt"])

    # Rebuild game state
    game = HeardleGame()
    game.load_existing(filename, url)

    result = game.evaluate(guess_text, attempt)
    return jsonify(result)

@game_bp.route("/song/<filename>")
def song(filename):
    #full_path= os.path.join(path, game.filename)            
    return send_from_directory(path, filename)

