import imaplib
import email
import time
from dotenv import load_dotenv
import os
import re
from parsers.nikeParse import parse_nike_email
from utils.upsTracking import trackUPS

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
        print("Connected.")
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

    file = open("email.txt", "a")
    file.write(str(emailBody))
    file.close()

    fromPattern = r'[\w\.-]+@[\w\.-]+\.\w+'

    match = re.search(fromPattern, str(emailBody))

    if match:
        Email.emailFrom = match.group()
        print(f"Email From: {Email.emailFrom}")

        if Email.emailFrom == "nike@official.nike.com":
            print("Parsing Nike email.")
            #parse_nike_email(Email)
        else:
            return

    print(trackUPS("1Z12345E0305271640"))

if __name__ == "__main__":

    load_dotenv()
    EMAIL = os.getenv("EMAIL")
    PASSWORD = os.getenv("PASSWORD")

    Mailbox = connectMailbox(EMAIL, PASSWORD)
    if Mailbox == None:
        print("Error.")
        exit()

    #TODO: Handle timeouts
    while True:
        emails = getEmails(Mailbox)

        if emails != None:
            for email in emails:
                parseEmail(email)
                time.sleep(41029412)
        else:
            print("No emails.")

        time.sleep(60)