import sys
import os
sys.path.insert(1, os.path.dirname(os.getcwd()))

import funcs
import util

if __name__=="__main__":
    uuid = "12345"

    # User
    funcs.insertUser(
        uuid=uuid,
        firstName="Sam",
        lastName="Anderson"
    )

    # Order
    funcs.insertOrder(
        uuid=uuid,
        orderID="abc",
        prodName="Yeezy Slides",
        carrier="UPS",
        source="Amazon",
        dateAdded="2024-02-13",
        estDelivery="2024-03-05",
        status=0,
        trackCode="c0de"
    )

    # Emails
    funcs.insertEmail(
        orderID="abc",
        content="Your order was received.",
        dateReceived="2024-02-13"
    )
    funcs.insertEmail(
        orderID="abc",
        content="Your order was sent.",
        dateReceived="2024-03-01"
    )
    funcs.insertEmail(
        orderID="abc",
        content="Your order was delivered.",
        dateReceived="2024-03-05"
    )


    info = util.getUserInfo(uuid)
    orders = util.getOrdersForUser(uuid)
    emails = util.getEmailsForUser(uuid)

    print("User info:")
    for k in info.keys():
        print(f"'{k}':", info[k])

    print("\nOrders:")
    for o in orders:
        for k in o.keys():
            print(f"'{k}':", o[k])
        print()
    
    print("\nEmails:")
    for e in emails:
        for k in e.keys():
            print(f"'{k}':", e[k])
        print()
