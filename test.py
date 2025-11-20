import base64
import requests

url = "http://127.0.0.1:5000/register"

username = "Mauricio"
password = "mypassword123"

encoded_pw = base64.b64encode(password.encode("utf-8")).decode("utf-8")

data = {
    "username": username,
    "password": encoded_pw
}

response = requests.post(url, json=data)

print("Status code:", response.status_code)
print("Response:", response.json())
