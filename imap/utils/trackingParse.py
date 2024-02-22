# trackingParse.py
import re

def parseTracking(Email):
    emailBody = Email.emailBody[0]

    patterns = [
            r'\b1Z[A-Z0-9]{16}\b',  # UPS format
            r'\b\d+[A-Z]+\d+\b',    # Generic format
            r'\b\d{20}\b',          # FedEx format
            r'\b91\d+\b',           # USPS format
        ]
    tracking = []

    for pattern in patterns:
        tracking.extend(re.findall(pattern, str(emailBody)))


    Email.trackingCode = tracking
