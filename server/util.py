import psycopg2
from psycopg2.extras import DictCursor

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
    
def removeEmailsByID(email_id):
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

    try:
        cur.execute("""
            INSERT OR IGNORE INTO "OrderEvent"
            (
                "order",
                description,
                date
            )
            VALUES (%s,%s,%s)
        """, 
            (
                order,
                desc,
                date,
            )
        )
        con.commit()
    except Exception as e:
        raise e
    finally:
        con.close()

def getOrderEventsForOrder(order_id):
    con = get_db_connection()
    cur = con.cursor(cursor_factory=DictCursor)

    try:
        cur.execute("""
            SELECT "OrderEvent".desc, "OrderEvent".date
            FROM "OrderEvent"
            JOIN "Order" ON "OrderEvent"."order" = "Order".orderID
            WHERE "Order".orderID = %s
        """, (order_id,))
        emails = cur.fetchall()

        return emails
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