from dotenv import load_dotenv
import requests
import os
import uuid

from requests.models import Response

# Returns a UPS API access token
def getToken():
    load_dotenv()

    CLIENT_ID = os.getenv("CLIENT_ID")
    CLIENT_SECRET = os.getenv("CLIENT_SECRET")

    if CLIENT_ID is None or CLIENT_SECRET is None:
        print("Error: Missing UPS API credentials.")
        return


    url = "https://wwwcie.ups.com/security/v1/oauth/token"

    payload = {
       "grant_type": "client_credentials"
    }

    headers = {
    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }

    response = requests.request("POST", url, headers=headers, data=payload, auth=(CLIENT_ID, CLIENT_SECRET))

    try:
        return response.json()["access_token"]
    except:
        return None

def refreshToken():
    pass

# Returns a JSON object with tracking information
def trackUPS(trackingNumber):
    ACCESS_TOKEN = getToken()

    if ACCESS_TOKEN == None:
        return

    url = f"https://wwwcie.ups.com/api/track/v1/details/{trackingNumber}?locale=en_US&returnSignature=false&returnMilestones=false"

    headers = {
      "transId": str(uuid.uuid4()),
      "transactionSrc": "testing",
      "Authorization": "Bearer " + ACCESS_TOKEN
    }

    response = requests.get(url, headers=headers)

    return response.json()
