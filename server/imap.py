import imaplib
import email
import time
from dotenv import load_dotenv
import os
import re

SERVER = "imap.gmail.com"
PORT = 993

SUPPORTED_STORES = [""]

class Email:
    emailTo = ""
    emailFrom = ""
    emailSubject = ""
    emailDate = ""
    emailBody = ""
    trackingCode  = ""
    orderNumber = ""
    orderPrice = ""


    def __init__(self, emailTo, emailFrom, emailSubject, emailDate, emailBody):
        self.emailTo = emailTo
        self.emailFrom = emailFrom
        self.emailSubject = emailSubject
        self.emailDate = emailDate
        self.emailBody = emailBody

# Connect to the mailbox
def connectMailbox(EMAIL, PASSWORD):
    Mailbox = imaplib.IMAP4_SSL(SERVER, PORT)
    status = Mailbox.login(EMAIL, PASSWORD)

    if status[0] == 'OK':
        print("Conected.")
    else:
        print("Error.")
        return None

    Mailbox.select('inbox')

    return Mailbox

# Return a list of emails from the mailbox
def getEmails(Mailbox):
    status, data = Mailbox.search(None, 'ALL')

    if status != 'OK':
        print("No messages found.")
        return None

    emails = []

    for num in data[0].split():
        rv, data = Mailbox.fetch(num, '(RFC822)')
        if rv != 'OK':
            print("ERROR getting message", num)
            continue

        msg = email.message_from_bytes(data[0][1])
        emailTo = msg['To']
        emailFrom = msg['From']
        emailSubject = msg['Subject']
        emailDate = msg['Date']
        emailBody = msg.get_payload()

        emails.append(Email(emailTo, emailFrom, emailSubject, emailDate, emailBody))

    return emails

# Currently only supports
# Nike orders with UPS, 
#FedEx, USPS and generic tracking numbers
def parseEmail(Email):
    emailBody = Email.emailBody[0]

    patterns = [
            r'\b1Z[A-Z0-9]{16}\b',  # UPS format
            r'\b\d+[A-Z]+\d+\b',    # Generic format
            r'\b\d{20}\b',          # FedEx format
            r'\b91\d+\b',           # USPS format
        ]

    for pattern in patterns:
            match = re.search(pattern, str(emailBody))
            if match:
                tracking_number = match.group()
                print(f"Tracking Number: {tracking_number}")
                return



if __name__ == "__main__":

    load_dotenv()

    EMAIL = os.getenv("EMAIL")
    PASSWORD = os.getenv("PASSWORD")

    Mailbox = connectMailbox(EMAIL, PASSWORD)
    if Mailbox == None:
        print("Error.")
        exit()

    while True:
        emails = getEmails(Mailbox)

        if emails != None:
            for email in emails:
                print(email.emailSubject)
                print(email.emailDate)
                print(email.emailFrom)
                print(email.emailTo)
                print("\n")
                parseEmail(email)
        else:
            print("No emails.")
            
        time.sleep(300)
    