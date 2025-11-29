import base64
import requests

# Tests Register logic

url = "http://127.0.0.1:5000/register"

email = "catalamantes@miners.utep.edu"
password = "123456789"

encoded_pw = base64.b64encode(password.encode("utf-8")).decode("utf-8")

data = {
    "email": email,
    "password": encoded_pw
}

response = requests.post(url, json=data)

print("Status code:", response.status_code)
print("Response:", response.json())