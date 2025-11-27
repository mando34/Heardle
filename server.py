from pathlib import Path
from dotenv import load_dotenv
import os

# Load backend environment (ensure secrets and ports are loaded)
env_path = Path(__file__).resolve().parent / "src" / "backend" / ".env"
load_dotenv(env_path)

from src.backend import create_app

app = create_app()

if __name__ == "__main__":
    host = os.getenv("BACKEND_HOST", "127.0.0.1")
    port = int(os.getenv("BACKEND_PORT", os.getenv("PORT", 5000)))
    debug = os.getenv("FLASK_DEBUG", "True").lower() in ("1", "true", "yes")
    app.run(host=host, port=port, debug=debug)