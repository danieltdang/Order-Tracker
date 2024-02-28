from dotenv import load_dotenv
import requests
import os
import base64

def getToken():
    load_dotenv()

    CLIENT_ID = os.getenv("CLIENT_ID")
    CLIENT_SECRET = os.getenv("CLIENT_SECRET")

    if CLIENT_ID is None or CLIENT_SECRET is None:
        print("Error: Missing UPS API credentials.")
        return


    url = "https://wwwcie.ups.com/security/v1/oauth/token"

    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials"
    }

    headers = {
    'authorization': 'Basic TTYxN3UxT2pKWnV6ZEFoN1luTFFFY01haG5jYXpBcVczcWdBQWNLTVFvNDlRdWR3OnZTYjVlUDQ2VVphbFA3d3dtdWdPZkhhY2NWcklZRGc4elVmUmJCbmFlcjFuaXQ2NDJJaU5JSDdXR2J5YmZEMXk=',
    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    try:
        return response.json()["access_token"]
    except:
        return None

def refreshToken():
    pass

def trackUPS(trackingNumber):
    ACCESS_TOKEN = getToken()

    if ACCESS_TOKEN == None:
        return

    url = f"https://wwwcie.ups.com/track/v1/details/{trackingNumber}"

    query = {
      "locale": "en_US",
      "returnSignature": "false",
      "returnMilestones": "false"
    }

    headers = {
      "transId": "string",
      "transactionSrc": "testing",
      "Authorization": "Bearer " + ACCESS_TOKEN
    }

    response = requests.get(url, headers=headers, params=query)

    print(response.text)

    return response.json()
