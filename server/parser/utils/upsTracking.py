from dotenv import load_dotenv
import requests
import os
import uuid
from datetime import datetime

from requests.models import Response

# Returns a UPS API access token
def getToken():
    load_dotenv()

    CLIENT_ID = os.getenv("UPS_CLIENT_ID")
    CLIENT_SECRET = os.getenv("UPS_CLIENT_SECRET")

    if CLIENT_ID is None or CLIENT_SECRET is None:
        print("Error: Missing UPS API credentials.")
        return


    url = "https://onlinetools.ups.com/security/v1/oauth/token"

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

    url = f"https://onlinetools.ups.com/api/track/v1/details/{trackingNumber}?locale=en_US&returnSignature=false&returnMilestones=false"

    headers = {
      "transId": str(uuid.uuid4()),
      "transactionSrc": "testing",
      "Authorization": "Bearer " + ACCESS_TOKEN
    }

    response = requests.get(url, headers=headers)

    return response.json()

def handleUPS(trackingNumber):
    result = trackUPS(trackingNumber)

    if result == None:
        return None

    if result.get("trackResponse") == None:
        return None
    
    package = result["trackResponse"]["shipment"][0]["package"]

    Status = package[0]["activity"][0]["status"]["description"]
    trackingCode = package[0]["trackingNumber"]
    Source = "UPS"
    senderLocation = package[0]["packageAddress"][0]["address"]["city"] + ", " + package[0]["packageAddress"][0]["address"]["stateProvince"]
    receiverLocation = package[0]["packageAddress"][1]["address"]["city"] + ", " + package[0]["packageAddress"][1]["address"]["stateProvince"]
    dateAdded = ""
    estimatedDelivery = formatDate(package[0]["deliveryDate"][0]["date"])

    latestActivity = []
    for activity in package[0]["activity"]:

        location = ""
        status = ""
        date = ""
        time = ""

        if activity["status"]["type"] != "M":
            location = activity["location"]["address"]["city"] + ", " + activity["location"]["address"]["stateProvince"]
            status = activity["status"]["description"]
            date = activity["date"]
            time = activity["time"]
        else:
            location = "Unknown"
            status = activity["status"]["description"]
            date = activity["date"]
            time = activity["time"]

        data = {
            "location": location,
            "status":   status,
            "date":    formatDate(date),
            "time":   time
        }

        latestActivity.append(data)

    return {
        "Status": Status,
        "trackingCode": trackingCode,
        "Source": Source,
        "senderLocation": senderLocation,
        "receiverLocation": receiverLocation,
        "dateAdded": dateAdded,
        "estimatedDelivery": estimatedDelivery,
        "Events": latestActivity
    }

def formatDate(date):
    try:
        obj = datetime.strptime(date, "%Y%m%d")  # Parse the date string into a datetime object
        formatted_date = obj.strftime("%m/%d/%Y")  # Format the datetime object as a string in MM/DD/YYYY format
        return formatted_date
    except ValueError:
        return "Invalid date format"