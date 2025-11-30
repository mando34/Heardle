import os
import random
from song import Song
from game import Game
import sqlite3
import flask
import flask_cors

app = flask.Flask(__name__)
flask_cors.CORS(app)
current = None
score = None
@app.route("/start_game",methods=["POST"])
def game_setup():
    global current,score
    data = flask.request.get_json()
    selected_difficulty = data.get("difficulty")
    genre = data.get("genre")
    current = Game()
    song_name, song_artist = current.game_logic()
    score = 0
    return flask.jsonify({score,song_name, song_artist})

@app.route("/guess",methods=["POST"])
def check_song():

    correct_answer = game.guess_checking(guess)

    if correct_answer:
        game_score += game.score_boost(selected_difficulty)
        #print("POINTS")
        return game_score, 1
    else: 
        print("Incorrect, the answer was: ",song_name ," by ",song_artist)
        print("Your guess: ",guess)
        print("Final score: ",game_score)
        return game_score, 0




game_on = True
game_score = 0

#get the game settings here




while (game_on):
    #game_state()
    
    selected_difficulty = "normal"
    genre = "Rock"
    game, song_name, song_artist = game_setup(selected_difficulty,genre)
    
    #Get audio here possibly?
    guess = "SpIDERS"
    
    game_score, game_on = check_song(game,guess,song_name,song_artist,game_score)
    #tempary, get user input from page




        #temp to check but possibly switch game state here
