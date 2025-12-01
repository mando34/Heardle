import os
import random

class SongPicker:
    
    def __init__(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))

        src_dir = os.path.abspath(os.path.join(current_dir, "..", ".."))

        self.audio_folder = os.path.join(src_dir, "static", "audio")

        self.base_url = "http://127.0.0.1:8888/static/audio/"
        self.songs = []

        for filename in os.listdir(self.audio_folder):
            if filename.lower().endswith(".mp3"):
                self.songs.append(filename)

        if len(self.songs) == 0:
            raise ValueError("No mp3 files found")
    
    def pick_song(self):
        """Return (filename, url)"""
        rand = random.randint(0, len(self.songs) - 1)
        filename = self.songs[rand]
        url = self.base_url + filename
        return filename, url
