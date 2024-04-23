import requests
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("FEDEX_CLIENT_ID")
CLIENT_SECRET = os.getenv("FEDEX_CLIENT_SECRET")

# Returns a FedEx API access token
def getToken():
    url = "https://apis.fedex.com/oauth/token"

    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials",
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(url, headers=headers, data=payload)
    print(response.json())

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

    url = "https://apis.fedex.com/track/v1/trackingnumbers"

    payload = {
        "includeDetailedScans": True,
        "trackingInfo": [
        {
            "trackingNumberInfo": {
                "trackingNumber": trackingNumber,
            },
        },
    ],
  };

    headers = {
        'Content-Type': 'application/json',
        'X-locale': 'en_US',
        'Authorization': 'Bearer ' + ACCESS_TOKEN
    }

    response = requests.post(url, headers=headers, json=payload)

    print(response.json())

    return response.json()

def handleFedex(trackingNumber):
    result = fedexTracking(trackingNumber)

    if result == None:
        return None

    # If output not there, return cause error
    if result.get("output") == None:
        return None
    
    package = result["output"]["completeTrackResults"][0]["trackResults"][0]

    Status = package["latestStatusDetail"]["statusByLocale"]
    trackingCode = package["trackingNumberInfo"]["trackingNumber"]
    Source = "Fedex"
    senderLocation = package["shipperInformation"]["address"]["city"].title() + ", " + package["shipperInformation"]["address"]["stateOrProvinceCode"]
    receiverLocation = package["recipientInformation"]["address"]["city"].title() + ", " + package["recipientInformation"]["address"]["stateOrProvinceCode"]
    dateAdded = ""
    estimatedDelivery = "" # Not sure how to get this

    latestActivity = []
    for activity in package["scanEvents"]:
        
        location = ""
        status = ""
        date = ""
        time = ""

        if activity["eventType"] != "OC":
            location = activity["scanLocation"]["city"].title() + ", " + activity["scanLocation"]["stateOrProvinceCode"]
            dStatus = activity["derivedStatus"]
            status = activity["eventDescription"]
            date = activity["date"]
            time = ""
        else:
            location = ""
            dStatus = activity["derivedStatus"]
            status = activity["eventDescription"]
            date = activity["date"]
            time = ""

        latestActivity.append({
            "location": location,
            "dStatus": dStatus,
            "status": status,
            "date": date,
            "time": time
        })

    return {
        "Status": Status,
        "trackingCode": trackingCode,
        "Source": Source,
        "senderLocation": senderLocation,
        "receiverLocation": receiverLocation,
        "dateAdded": dateAdded,
        "estimatedDelivery": estimatedDelivery,
        "latestActivity": latestActivity
    }

print(handleFedex("272399537363"))


