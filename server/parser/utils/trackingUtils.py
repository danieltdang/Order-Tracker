import upsTracking as ups
import fedexTracking as fedex


def handleUPS(trackingNumber):
    result = ups.trackUPS(trackingNumber)
    if result is None:
        return None

    return parseTrackingResult(result, "UPS")

def handleFedEx(trackingNumber):
    result = fedex.trackFedEx(trackingNumber)
    if result is None:
        return None

    return parseTrackingResult(result, "FedEx")

def parseTrackingResult(result, carrier):
    if carrier == "UPS":
        package = result["trackResponse"]["shipment"][0]["package"]
    elif carrier == "FedEx":
        package = result["CompletedTrackDetails"]["TrackDetails"]["Events"]
    else:
        return None

    try:
        if carrier == "UPS":
            Status = package[0]["activity"][0]["status"]["description"]
            trackingCode = package[0]["trackingNumber"]
            senderLocation = package[0]["packageAddress"][0]["address"]["city"] + ", " + package[0]["packageAddress"][0]["address"]["stateProvince"]
            receiverLocation = package[0]["packageAddress"][1]["address"]["city"] + ", " + package[0]["packageAddress"][1]["address"]["stateProvince"]
            estimatedDelivery = package[0]["deliveryDate"][0]["date"]
            latestActivity = [
                Events(activity["location"], activity["status"]["description"], activity["date"], activity["time"])
                for activity in package[0]["activity"]
            ]
        elif carrier == "FedEx":
            Status = package["EventDescription"]
            trackingCode = result["CompletedTrackDetails"]["TrackDetails"]["TrackingNumber"]
            senderLocation = "Unknown"  # Example, adapt according to the actual FedEx response structure
            receiverLocation = "Unknown"
            estimatedDelivery = "Unknown"  # Adapt this field accordingly
            latestActivity = [
                Events("Unknown", event["EventDescription"], event["Date"], event["Time"])
                for event in package
            ]

        return {
            "status": Status,
            "tracking_code": trackingCode,
            "source": carrier,
            "sender_location": senderLocation,
            "receiver_location": receiverLocation,
            "estimated_delivery": estimatedDelivery,
            "latest_activity": latestActivity
        }
    except KeyError:
        # Handle possible mismatches in the expected response structure
        return None