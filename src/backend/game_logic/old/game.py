import os
import random
from song import Song
import sqlite3
import flask
import flask_cors

app = flask.Flask(__name__)
flask_cors.CORS(app)
class Game:
    def __init__(self):
        self.game_score = 0
        self.current_song_name=""
        self.current_song_artist=""
        self.game_difficulty = {"easy": 1,"normal": 3,"hard": 5}
        self.game_genre = ["Rock","Pop","Rap","Modern hits","Country","Blues","Indie","Classic hits"]

    def game_logic(self):
        files = Song.audio_directory()
        fileAmount = len(files)
        random_song = random.randint(0,fileAmount-1)
        self.current_song_name, self.current_song_artist = Song.song_metadeta(random_song,files)
        #print(song_name,song_artist)
        #Link audio to html here
        return self.current_song_name, self.current_song_artist


    def string_fixer(self,input):
        lowerString = input.strip().lower()
        return lowerString

    
    
    def guess_checking(self,guess):
        correct_answer = False
    
        song_name_fixed = self.string_fixer(self.current_song_name)
        song_artist_fixed = self.string_fixer(self.current_song_artist)
        guess_lower = self.string_fixer(guess)

        if guess_lower == song_artist_fixed:
            correct_answer = True 

        if guess_lower == song_name_fixed:
            correct_answer = True

        return correct_answer

    def score_boost(self,selected_difficulty):
        boost = self.game_difficulty[selected_difficulty]
        self.game_score += boost
        return self.game_score


    def database():
        db_path = os.path.join(os.getcwd(), "heardle.db")
        db = sqlite3.connect(db_path)
        cur = db.cursor()


#def game_state(game_state):
    #match game_state:
        #case 0:
            #game_logic()
            #game_state = 1
        #case 1:
            #game_state = 2
        #case 2:
            #game_on = False

    
#@app.route('/')
