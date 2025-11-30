from .song_picker import SongPicker
import os

class HeardleGame:

    def __init__(self):
        self.picker = SongPicker()
        self.filename = None
        self.url = None
        self.hint_lengths = [1, 2, 4, 7, 11, 16]
        self.song = None
        self.artist = None

    def start(self):
        result = self.picker.pick_song()
        self.filename = result[0]
        self.url = result[1]
        self.namesFix()

    def namesFix(self):
            song_data = os.path.splitext(self.filename)[0]  # take only the root
            parts = song_data.split(" - ", 1)
            if len(parts) == 2:
                self.artist = parts[0]
                self.song = parts[1]
            else:
                self.artist = ""
                self.song = song_data


    def load_existing(self, filename, url):
        self.filename = filename
        self.url = url

    def get_answer(self):
        pos = self.filename.rfind(".")
        return self.filename[:pos]

    def snippet_for_attempt(self, attempt):
        index = attempt - 1
        if index < len(self.hint_lengths):
            return self.hint_lengths[index]
        return self.hint_lengths[len(self.hint_lengths) - 1]

    def evaluate(self, guess, attempt):
        answer = self.get_answer().lower()
        guess_clean = guess.strip().lower()

        if guess_clean == answer:
            return {
                "correct": True,
                "win": True,
                "answer": answer
            }

        last_round = len(self.hint_lengths)

        if attempt >= last_round:
            return {
                "correct": False,
                "lose": True,
                "answer": answer
            }

        next_attempt = attempt + 1
        next_length = self.snippet_for_attempt(next_attempt)

        return {
            "correct": False,
            "continue": True,
            "next_attempt": next_attempt,
            "snippet_seconds": next_length
        }
