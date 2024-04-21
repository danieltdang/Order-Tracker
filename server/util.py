import psycopg2
from psycopg2.extras import DictCursor
import parser.utils.upsTracking as upsTracking
from datetime import datetime

def get_db_connection():
    con = psycopg2.connect(
        host="isilo.db.elephantsql.com",
        database="qkhplpdv",
        user="qkhplpdv",
        password="MPRLThmEO3gFiPHKrX9ajpKo-hSKOLOa"
    )
    print("Connected to at isilo.db.elephantsql.com")
    return con

def addUser(firstName, lastName, uuid):
    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""
            INSERT INTO "User"
            (uuid, firstName, lastName)
            VALUES (%s, %s, %s)
        """, (uuid, firstName, lastName))
        
        # Get inserted user and commit insert
        con.commit()
    finally:
        con.close()

def removeUser(uuid):
    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""
            SELECT COUNT(*) FROM "User" WHERE "User".uuid = %s
        """, (uuid,))
        
        if cur.fetchone()[0] == 0:
            return False
        
        cur.execute("""
            DELETE FROM "User"
            WHERE "User".uuid = %s
        """, (uuid,))
        
        # Get inserted user and commit insert
        con.commit()
        return True
    except:
        raise Exception(f"Error occured while trying to remove user {uuid}.")
    finally:
        con.close()

def getUserInfo(uuid):
    con = get_db_connection()
    cur = con.cursor(cursor_factory=DictCursor)

    try:
        cur.execute("""
            SELECT * FROM "User"
            WHERE "User".uuid = %s
        """, (uuid,))
        user = cur.fetchone()

        return user
    except:
        raise Exception(f"Error occured when trying to retrieve info on user '{uuid}'.")
    finally:
        con.close()

def getAllUsers():
    con = get_db_connection()
    cur = con.cursor(cursor_factory=DictCursor)

    try:
        cur.execute("""
            SELECT * FROM "User"
        """)
        users = cur.fetchall()

        return users
    except:
        raise Exception(f"Error occured when trying to retrieve users.")
    finally:
        con.close()




def addOrder(
    user, 
    prodName,
    status,
    trackCode,
    estDelivery, 
    carrier,
    source,
    dateAdded,
    senderLocation, 
    receiverLocation
):
    con = get_db_connection()
    cur = con.cursor()

    # orderID omitted as it will auto increment
    try:
        cur.execute("""
            INSERT INTO "Order"
            (
                "user",
                productname,
                status,
                trackingcode,
                estimateddelivery,
                carrier,
                source,
                dateadded,
                senderlocation,
                receiverlocation
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, 
            (
                user,
                prodName,
                status,
                trackCode,
                estDelivery,
                carrier,
                source,
                dateAdded,
                senderLocation,
                receiverLocation
            )
        )
        con.commit()
    except:
        raise Exception("Error occurred when trying to insert order.")
    finally:
        order_id = cur.lastrowid
        con.close()
        return order_id

def getOrdersForUser(uuid):
    con = get_db_connection()
    cur = con.cursor(cursor_factory=DictCursor)

    try:
        cur.execute("""
            SELECT * FROM "Order"
            WHERE "Order".user = %s
        """, (uuid,))
        orders = cur.fetchall()
        
        return orders
    except:
        raise Exception(f"Error occured when trying to retrieve orders for user '{uuid}'.")
    finally:
        con.close()

def getOrderInfo(user, order_id):
    con = get_db_connection()
    cur = con.cursor(cursor_factory=DictCursor)

    try:
        cur.execute("""
            SELECT * FROM "Order"
            WHERE "Order".user = %s AND "Order".orderID = %s
        """, (user, order_id))
        order = cur.fetchone()

        return order
    except:
        raise Exception(f"Error occured when trying to retrieve order {order_id} from user '{user}'.")
    finally:
        con.close()

def removeOrder(order):
    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""
            DELETE FROM "Order"
            WHERE "Order".orderID = %s
        """, 
            (order,)
        )
        con.commit()
    except Exception as e:
        raise e
    finally:
        con.close()
        return True

def updateOrder(
    order_id,
    prodName,
    status,
    trackCode,
    estDelivery, 
    carrier,
    source,
    dateAdded,
    senderLocation, 
    receiverLocation
):
    con = get_db_connection()
    cur = con.cursor()

    # orderID omitted as it will auto increment
    try:
        cur.execute("""
            UPDATE "Order"
            SET productname = %s,
                status = %s,
                trackingcode = %s,
                estimateddelivery = %s,
                carrier = %s,
                source = %s,
                dateadded = %s,
                senderlocation = %s,
                receiverlocation = %s
            WHERE "Order"."orderid" = %s
        """, 
            (
                prodName,
                status,
                trackCode,
                estDelivery,
                carrier,
                source,
                dateAdded,
                senderLocation,
                receiverLocation,
                order_id
            )
        )
        con.commit()
    except:
        raise Exception("Error occurred when trying to update order.")
    finally:
        con.close()

def getOrderStats(uuid):
    con = get_db_connection()
    cur = con.cursor()

    statuses = []
    try:
        # Using an explicit list of status integers to ensure it matches expected stats
        for status in range(4):
            cur.execute("""
                SELECT COUNT(*) FROM "Order"
                WHERE "Order"."user" = %s AND "Order"."status" = %s
            """, (uuid, status))
            statuses.append(cur.fetchone()[0])
        
        # Query for the total count of orders by the user
        cur.execute("""
            SELECT COUNT(*) FROM "Order"
            WHERE "Order"."user" = %s
        """, (uuid,))
        statuses.append(cur.fetchone()[0])

        # Query for the count of emails related to user's orders
        cur.execute("""
            SELECT COUNT(*) FROM "Email"
            JOIN "Order" ON "Email"."order" = "Order".orderid
            WHERE "Order"."user" = %s
        """, (uuid,))
        statuses.append(cur.fetchone()[0])

        return statuses
    except:
        raise Exception(f"Error occured when trying to retrieve stats for user '{uuid}'.")
    finally:
        con.close()






def addEmail(subject, status, order, content, source, dateReceived):
    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""
            INSERT INTO "Email"
            (
                subject,
                status,
                "order",
                subject,
                content,
                source,
                datereceived
            )
            VALUES (%s,%s,%s,%s,%s,%s)
        """, 
            (
                subject,
                status,
                order,
                subject,
                content,
                source,
                dateReceived,
            )
        )
        con.commit()
    except Exception as e:
        raise e
    finally:
        con.close()

def getEmailsForUser(uuid):
    con = get_db_connection()
    cur = con.cursor(cursor_factory=DictCursor)

    try:
        cur.execute("""
            SELECT "Email"."order", "Email".content, "Email".dateReceived, "Email"."emailID", "Email".subject, "Email".status, "Email".source
            FROM "Email"
            JOIN "Order" ON "Email"."order" = "Order".orderID
            JOIN "User" ON "Order"."user" = "User".uuid
            WHERE "User".uuid = %s
        """, (uuid,))
        emails = cur.fetchall()

        return emails
    except:
        raise Exception(f"Error occured when trying to retrieve emails for user '{uuid}'.")
    finally:
        con.close()

def getEmailsForOrder(order_id):
    con = get_db_connection()
    cur = con.cursor(cursor_factory=DictCursor)

    try:
        cur.execute("""
            SELECT "Email"."order", "Email".content, "Email".dateReceived, "Email"."emailID", "Email".subject, "Email".status, "Email".source
            FROM "Email"
            JOIN "Order" ON "Email"."order" = "Order".orderID
            WHERE "Order".orderID = %s
        """, (order_id,))
        emails = cur.fetchall()
        
        return emails
    except:
        raise Exception(f"Error occured when trying to retrieve emails for order '{order_id}'.")
    finally:
        con.close()

def removeEmailForOrder(order):
    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""
            DELETE FROM "Email"
            WHERE "Email"."order" = %s
        """, 
            (order,)
        )
        con.commit()
    except Exception as e:
        raise e
    finally:
        con.close()
        return True

def updateEmail(
    email_id,
    subject,
    status,
    source,
    order,
    content,
    dateReceived,
):
    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""
            UPDATE "Email"
            SET subject = %s,
                status = %s,
                source = %s,
                "order" = %s,
                content = %s,
                datereceived = %s
            WHERE "Email"."emailID" = %s
        """, 
            (
                subject,
                status,
                source,
                order,
                content,
                dateReceived,
                email_id
            )
        )
        con.commit()
    except:
        raise Exception("Error occurred when trying to update email.")
    finally:
        con.close()

def removeEmailByID(email_id):
    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""
            DELETE FROM "Email"
            WHERE "Email"."emailID" = %s
        """, 
            (email_id,)
        )
        con.commit()
    except Exception as e:
        raise e
    finally:
        con.close()
        return True





def addOrderEvent(order, desc, date):
    con = get_db_connection()
    cur = con.cursor()

    print("Adding order: ", order, desc, date)

    try:
        cur.execute("""
            INSERT INTO "OrderEvent" ("order", description, date)
            VALUES (%s, %s, %s)
            ON CONFLICT DO NOTHING
        """, (order, desc, date))                
        con.commit()
    except psycopg2.DatabaseError as e:
        # This catches PostgreSQL-specific errors
        error_msg = f"Database error occurred: {e}"
        print(error_msg)  # Optionally log to a file or logging system
        raise Exception(error_msg)
    except Exception as e:
        raise e
    finally:
        con.close()

def getOrderEventsForOrder(order_id):
    con = get_db_connection()
    cur = con.cursor(cursor_factory=DictCursor)

    try:
        cur.execute("""
            SELECT description, date
            FROM "OrderEvent"
            WHERE "order" = %s
            ORDER BY date DESC
        """, (order_id,))
        events = cur.fetchall()
        return events
    except:
        raise Exception(f"Error occured when trying to retrieve orderEvents for order '{order_id}'.")
    finally:
        con.close()

def removeOrderEventsForOrder(order):
    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""
            DELETE FROM "OrderEvent"
            WHERE "OrderEvent"."order" = %s
        """, 
            (order,)
        )
        con.commit()
    except Exception as e:
        raise e
    finally:
        con.close()
        return True
    
# Retrieve tracking code from order
def retrieveTrackingData(user, order):
    con = get_db_connection()
    cur = con.cursor()

    print(user, order)

    trackingCode, Carrier = None, None

    try:
        cur.execute("""
            SELECT trackingcode, carrier FROM "Order"
            WHERE "Order".user = %s AND "Order".orderID = %s
        """, (user, order))
        trackingCode, Carrier = cur.fetchone()
    except:
        raise Exception(f"Error occured when trying to retrieve tracking data for order '{order}' from user '{user}'.")
    finally:
        con.close()
        return trackingCode, Carrier


def refreshOrder(user, order):
    trackingCode, Carrier = retrieveTrackingData(user, order)
    if trackingCode == None:
        print("Returning cause tracking code is None")
        return False
    
    if Carrier == "UPS":
        result = upsTracking.handleUPS(trackingCode)
    elif Carrier == "FedEx":
        result = upsTracking.trackFedEx(trackingCode)
    else:
        print("Carrier not supported")
        return False
    
    # Implement results from Fedex/UPS tracking to update order data

    if result == None:
        print("Result is None")
        return False
    
    # Check if latest activity is different from the one in the database

    events = getOrderEventsForOrder(order)

    # If no events, add all events
    if len(events) == 0:
        for event in result["Events"]:
            addOrderEvent(order, event["status"], event["date"])
        return True
    
    for event in events:
        for newEvent in result["Events"]:
            found = False

            if newEvent["status"] != event["description"] or newEvent["date"] != event["date"]:
                found = False
                break
            
            if not found:
                addOrderEvent(order, newEvent["status"], newEvent["date"])



    # Update tracking details
    storedOrder = getOrderInfo(user, order)

    if storedOrder == None:
        print("Stored order is None")
        return False
    
    # Update status
    newStatus = storedOrder["status"]
    if Carrier == "UPS":
        print(result["Events"][0]["status"])
        if result["Events"][0]["status"].strip(" ").lower() == "we have your package":
            newStatus = 0
        elif result["Events"][0]["status"].strip(" ").lower() == "departed from facility" or result["Events"][0]["status"].strip(" ").lower() == "arrived from facility":
            newStatus = 1
        elif result["Events"][0]["status"].strip(" ").lower() == "loaded on delivery vehicle" or result["Events"][0]["status"].strip(" ").lower() == "out for delivery":
            newStatus = 2
        elif result["Events"][0]["status"].strip(" ").lower() == "delivered":
            newStatus = 3
        


    if storedOrder["status"] != result["Status"] or storedOrder["estimateddelivery"] != result["estimatedDelivery"]:
        updateOrder(
            order,
            storedOrder["productname"],
            newStatus,
            trackingCode,
            result["estimatedDelivery"],
            Carrier,
            storedOrder["source"],
            storedOrder["dateadded"],
            result["senderLocation"],
            result["receiverLocation"]
        )

    return True


