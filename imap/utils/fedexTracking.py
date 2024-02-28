import requests
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("FEDEX_CLIENT_ID")
CLIENT_SECRET = os.getenv("FEDEX_CLIENT_SECRET")

# Returns a FedEx API access token
def getToken():
    url = "https://apis-sandbox.fedex.com/oauth/token"

    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials",
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(url, headers=headers, data=payload)

    try:
        return response.json()["access_token"]
    except:
        return None

# Returns a JSON object with tracking information
# DOES NOT HANDLE MULTIPLE TRACKING NUMBERS
def fedexTracking(trackingNumber):
    ACCESS_TOKEN = getToken()

    if ACCESS_TOKEN == None:
        return

    url = "https://apis-sandbox.fedex.com/track/v1/trackingnumbers"

    payload = {
        "trackingInfo": {
            "trackingNumber": trackingNumber,
        },
        "includeDetailedScans": True
    }

    headers = {
        'Content-Type': 'application/json',
        'X-locale': 'en_US',
        'Authorization': 'Bearer ' + ACCESS_TOKEN
    }

    response = requests.post(url, headers=headers, json=payload)

    print(response.json())

    return response.json()
