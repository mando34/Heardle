import base64
import requests

# Tests login

EMAIL = "memayorga@miners.utep.edu"
PASSWORD = "password123"

URL = "http://127.0.0.1:5000/login"

encoded_password = base64.b64encode(PASSWORD.encode("utf-8")).decode("utf-8")

payload = {
    "email": EMAIL,
    "password": encoded_password
}

response = requests.post(URL, json=payload)

print(f"Status Code: {response.status_code}")
print("Response JSON:")
try:
    print(response.json())
except:
    print("Non-JSON response:")
    print(response.text)
