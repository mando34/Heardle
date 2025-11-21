from guess_checker import GuessChecker

def test_exact_match():
    gc = GuessChecker()
    result = gc.check_guess("Song Title", "Song Title")
    print(result)
    assert result["correct"] is True
    assert result["attempts"] == 1
    assert result["game_over"] is True

def test_case_insensitivity():
    gc = GuessChecker()
    result = gc.check_guess("song title", "Song Title")
    print(result)
    assert result["correct"] is True
    assert result["attempts"] == 1
    assert result["game_over"] is True

def test_whitespace_ignored():
    gc = GuessChecker()
    result = gc.check_guess("  Song Title  ", "Song Title")
    print(result)
    assert result["correct"] is True
    assert result["attempts"] == 1
    assert result["game_over"] is True

def test_incorrect_guess():
    gc = GuessChecker()
    result = gc.check_guess("Wrong Title", "Song Title")
    print(result)
    assert result["correct"] is False
    assert result["attempts"] == 1
    assert result["game_over"] is False

def test_empty_guess():
    gc = GuessChecker()
    result = gc.check_guess("", "Song Title")
    print(result)
    assert result["correct"] is False
    assert result["attempts"] == 1
    assert result["game_over"] is False
