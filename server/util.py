import sqlite3 as sql

DB_PATH = 'database.db'

def addUser(firstName, lastName, uuid):
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        cur.execute("""
            INSERT INTO "User"
            (uuid, firstName, lastName)
            VALUES (?, ?, ?)
        """, (uuid, firstName, lastName))
        
        # Get inserted user and commit insert
        con.commit()
    finally:
        con.close()

def removeUser(uuid):
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        cur.execute("""
            SELECT COUNT(*) FROM "User" WHERE "User".uuid = ?
        """, (uuid,))
        
        if cur.fetchone()[0] == 0:
            return False
        
        cur.execute("""
            DELETE FROM "User"
            WHERE "User".uuid = ?
        """, (uuid,))
        
        # Get inserted user and commit insert
        con.commit()
        return True
    except:
        raise Exception(f"Error occured while trying to remove user {uuid}.")
    finally:
        con.close()

def getUserInfo(uuid):
    con = sql.connect(DB_PATH)
    con.row_factory = sql.Row
    cur = con.cursor()

    try:
        cur.execute("""
            SELECT * FROM "User"
            WHERE "User".uuid = ?
        """, (uuid,))
        user = cur.fetchone()

        return user
    except:
        raise Exception(f"Error occured when trying to retrieve info on user '{uuid}'.")
    finally:
        con.close()

def getAllUsers():
    con = sql.connect(DB_PATH)
    con.row_factory = sql.Row
    cur = con.cursor()

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
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    # orderID omitted as it will auto increment
    try:
        cur.execute("""
            INSERT OR IGNORE INTO "Order"
            (
                "user",
                productName,
                status,
                trackingCode,
                estimatedDelivery,
                carrier,
                source,
                dateAdded,
                senderLocation,
                receiverLocation
            )
            VALUES (?,?,?,?,?,?,?,?,?,?)
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
    con = sql.connect(DB_PATH)
    con.row_factory = sql.Row
    cur = con.cursor()

    try:
        cur.execute("""
            SELECT * FROM "Order"
            WHERE "Order".user = ?
        """, (uuid,))
        orders = cur.fetchall()

        return orders
    except:
        raise Exception(f"Error occured when trying to retrieve orders for user '{uuid}'.")
    finally:
        con.close()

def getOrderInfo(user, order_id):
    con = sql.connect(DB_PATH)
    con.row_factory = sql.Row
    cur = con.cursor()

    try:
        cur.execute("""
            SELECT * FROM "Order"
            WHERE "Order".user = ? AND "Order".orderID = ?
        """, (user, order_id))
        order = cur.fetchone()

        return order
    except:
        raise Exception(f"Error occured when trying to retrieve order {order_id} from user '{uuid}'.")
    finally:
        con.close()

def removeOrder(order):
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        cur.execute("""
            DELETE FROM "Order"
            WHERE "Order".orderID = ?
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
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    # orderID omitted as it will auto increment
    try:
        cur.execute("""
            UPDATE "Order"
            SET productName = ?,
                status = ?,
                trackingCode = ?,
                estimatedDelivery = ?,
                carrier = ?,
                source = ?,
                dateAdded = ?,
                senderLocation = ?,
                receiverLocation = ?
            WHERE "Order"."orderID" = ?
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







def addEmail(order, content, dateReceived):
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        cur.execute("""
            INSERT OR IGNORE INTO "Email"
            (
                "order",
                content,
                dateReceived
            )
            VALUES (?,?,?)
        """, 
            (
                order,
                content,
                dateReceived,
            )
        )
        con.commit()
    except Exception as e:
        raise e
    finally:
        con.close()

def getEmailsForUser(uuid):
    con = sql.connect(DB_PATH)
    con.row_factory = sql.Row
    cur = con.cursor()

    try:
        cur.execute("""
            SELECT "Email"."order", "Email".content, "Email".dateReceived 
            FROM "Email"
            JOIN "Order" ON "Email"."order" = "Order".orderID
            JOIN "User" ON "Order"."user" = "User".uuid
            WHERE "User".uuid = ?
        """, (uuid,))
        emails = cur.fetchall()

        return emails
    except:
        raise Exception(f"Error occured when trying to retrieve emails for user '{uuid}'.")
    finally:
        con.close()

def getEmailsForOrder(order_id):
    con = sql.connect(DB_PATH)
    con.row_factory = sql.Row
    cur = con.cursor()

    try:
        cur.execute("""
            SELECT "Email"."order", "Email".content, "Email".dateReceived 
            FROM "Email"
            JOIN "Order" ON "Email"."order" = "Order".orderID
            WHERE "Order".orderID = ?
        """, (order_id,))
        emails = cur.fetchall()

        return emails
    except:
        raise Exception(f"Error occured when trying to retrieve emails for order '{order_id}'.")
    finally:
        con.close()

def removeEmailForOrder(order):
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        cur.execute("""
            DELETE FROM "Email"
            WHERE "Email"."order" = ?
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
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        cur.execute("""
            DELETE FROM "Email"
            WHERE "Email"."emailID" = ?
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
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        cur.execute("""
            INSERT OR IGNORE INTO "OrderEvent"
            (
                "order",
                desc,
                date
            )
            VALUES (?,?,?)
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
    con = sql.connect(DB_PATH)
    con.row_factory = sql.Row
    cur = con.cursor()

    try:
        cur.execute("""
            SELECT * FROM "OrderEvent"
            JOIN "Order" ON "OrderEvent"."order" = "Order".orderID
            WHERE "Order".orderID = ?
        """, (order_id,))
        emails = cur.fetchall()

        return emails
    except:
        raise Exception(f"Error occured when trying to retrieve orderEvents for order '{order_id}'.")
    finally:
        con.close()

def removeOrderEventsForOrder(order):
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        cur.execute("""
            DELETE FROM "OrderEvent"
            WHERE "OrderEvent"."order" = ?
        """, 
            (order,)
        )
        con.commit()
    except Exception as e:
        raise e
    finally:
        con.close()
        return True