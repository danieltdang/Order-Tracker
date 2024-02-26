# nikeParse.py
# Parsing emails from Nike
from utils.trackingParse import parseTracking
import re

def parse_nike_email(Email):

    emailBody = Email.emailBody[0]
    
    # Parse tracking
    parseTracking(Email)

    # TODO: Parse order number
    orderNumberPattern = r'\bC[0-9]{11}\b',
    orderNumber = re.search(orderNumberPattern, str(emailBody))
    if orderNumber:
        Email.orderNumber = orderNumber.group()
        print(f"Order Number: {Email.orderNumber}")
