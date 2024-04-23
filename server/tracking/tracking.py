from dotenv import load_dotenv
import requests
import os
import uuid
from datetime import datetime

from requests.models import stream_decode_response_unicode

load_dotenv()

UPS_CLIENT_ID = os.getenv("UPS_CLIENT_ID")
UPS_CLIENT_SECRET = os.getenv("UPS_CLIENT_SECRET")
FEDEX_CLIENT_ID = os.getenv("FEDEX_CLIENT_ID")
FEDEX_CLIENT_SECRET = os.getenv("FEDEX_CLIENT_SECRET")

# Returns a UPS API access token
def getUPSToken():

    if UPS_CLIENT_ID is None or UPS_CLIENT_SECRET is None:
        print("Error: Missing UPS API credentials.")
        return


    url = "https://onlinetools.ups.com/security/v1/oauth/token"

    payload = {
       "grant_type": "client_credentials"
    }

    headers = {
    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }

    response = requests.request("POST", url, headers=headers, data=payload, auth=(UPS_CLIENT_ID, UPS_CLIENT_SECRET))

    try:
        return response.json()["access_token"]
    except:
        return None

def getFedexToken():
    url = "https://apis.fedex.com/oauth/token"

    payload = {
        "client_id": FEDEX_CLIENT_ID,
        "client_secret": FEDEX_CLIENT_SECRET,
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
def trackUPS(trackingNumber):
    ACCESS_TOKEN = getUPSToken()

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

def trackFedex(trackingNumber):
    ACCESS_TOKEN = getFedexToken()

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
    senderLocation = package[0]["packageAddress"][0]["address"]["city"].title() + ", " + package[0]["packageAddress"][0]["address"]["stateProvince"]
    receiverLocation = package[0]["packageAddress"][1]["address"]["city"].title() + ", " + package[0]["packageAddress"][1]["address"]["stateProvince"]
    dateAdded = ""
    estimatedDelivery = formatUPSDate(package[0]["deliveryDate"][0]["date"])

    latestActivity = []
    for activity in package[0]["activity"]:

        location = ""
        status = ""
        date = ""
        time = ""

        if activity["status"]["type"] != "M":
            location = activity["location"]["address"]["city"].title() + ", " + activity["location"]["address"]["stateProvince"]
            status = activity["status"]["description"].title()
            date = activity["date"]
            time = activity["time"]
        else:
            location = ""
            status = activity["status"]["description"].title()
            date = activity["date"]
            time = activity["time"]

        data = {
            "location": location,
            "status":   status,
            "date":    formatUPSDate(date),
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


def handleFedex(trackingNumber):
    result = trackFedex(trackingNumber)

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
    estimatedDelivery = formatFedexDate(package["dateAndTimes"][0]["dateTime"])

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
            "date": formatFedexDate(date),
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
        "Events": latestActivity
    }

def formatFedexDate(date):
    return date[5:7] + "/" + date[8:10] + "/" + date[0:4]

def formatUPSDate(date):
    try:
        obj = datetime.strptime(date, "%Y%m%d")
        formatted_date = obj.strftime("%m/%d/%Y")
        return formatted_date
    except ValueError:
        return "Invalid date format"