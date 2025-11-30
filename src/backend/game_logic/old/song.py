import os
from flask import current_app

class Song:
    def __init__(self,song_name,song_artist):
        self.song_name = song_name
        self.song_artist = song_artist

    def audio_directory():
        current = os.getcwd()
        audio_dir = r"\src\static\audio"
        path = current + audio_dir
        #print("test")
        #print(path)
        onlyfiles = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
        #print(onlyfiles)
        return onlyfiles

    def song_metadeta(x,onlyfiles): #x is file randomly typed
        if x < len(onlyfiles):
            #print("song is in list")
            data = onlyfiles[x]
            song_data = os.path.splitext(data)[0] #Remove file extension
            song_string = song_data.split(" - ",1) #split name at the "-"
            song_name = song_string[1] #Get the name from the split
            song_artist = song_string[0] #get artist from split
            return song_name, song_artist
        
        else:
            #print("error")
            return "",""


