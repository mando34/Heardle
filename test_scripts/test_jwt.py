import requests
import base64

# Tests token authentication 

EMAIL = "memayorga@miners.utep.edu"
PASSWORD = "password123"
BASE_URL = "http://127.0.0.1:5000"

encoded_pw = base64.b64encode(PASSWORD.encode("utf-8")).decode("utf-8")

login_payload = {
    "email": EMAIL,
    "password": encoded_pw
}

print("Logging in...")
login_res = requests.post(f"{BASE_URL}/login", json=login_payload)

print("Login status:", login_res.status_code)
print("Login response:", login_res.json())

if login_res.status_code != 200:
    print("Login failed.")
    exit()

valid_token = login_res.json()["token"]

headers_valid = {
    "Authorization": f"Bearer {valid_token}"
}

print("\nCalling /secret with valid token...")
secret_res = requests.get(f"{BASE_URL}/secret", headers=headers_valid)

print("Secret status:", secret_res.status_code)
print("Secret response:", secret_res.json())

broken_token = valid_token[:-1] + "X"

headers_broken = {
    "Authorization": f"Bearer {broken_token}"
}

print("\nCalling /secret with broken token...")
secret_res_broken = requests.get(f"{BASE_URL}/secret", headers=headers_broken)

print("Secret status:", secret_res_broken.status_code)
print("Secret response:", secret_res_broken.json())
