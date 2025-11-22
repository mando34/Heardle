# simple class to test guess checking logic
# can be implemented within a main game class later, or be its own class

class GuessChecker:
    """ Handles guess comparison logic for the heardle game.
    Compares user guesses against the correct track name.
    """
    MAX_ATTEMPTS = 6  # maximum number of allowed attempts

    def __init__(self):
        self.attempts = 0

    # remove leading/trailing spaces and convert to lowercase
    def setup_string(self, text):
        if not text:
            return ""
        return text.strip().lower()
    
    def check_guess(self, guess: str, correct_track: str) -> dict:

        self.attempts += 1

        is_correct = (
            self.setup_string(guess) == self.setup_string(correct_track)
        )
        
        game_over = is_correct or (self.attempts >= self.MAX_ATTEMPTS)
        
        return {
            "correct": is_correct,
            "attempts": self.attempts,
            "game_over": game_over
        }