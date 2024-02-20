import util
import mock_funcs as mock

if __name__=="__main__":
    uuid = "12345"

    # User
    mock.insertUser(
        uuid=uuid,
        firstName="Sam",
        lastName="Anderson"
    )

    # Order
    mock.insertOrder(
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
    mock.insertEmail(
        orderID="abc",
        content="Your order was received.",
        dateReceived="2024-02-13"
    )
    mock.insertEmail(
        orderID="abc",
        content="Your order was sent.",
        dateReceived="2024-03-01"
    )
    mock.insertEmail(
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
