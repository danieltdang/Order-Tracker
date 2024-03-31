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




def addOrder(uuid, orderID, prodName, status, trackCode, estDelivery, carrier, source, dateAdded):
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        cur.execute("""
            INSERT OR IGNORE INTO "Order"
            (
                orderID,
                "user",
                productName,
                status,
                trackingCode,
                estimatedDelivery,
                carrier,
                source,
                dateAdded
            )
            VALUES (?,?,?,?,?,?,?,?,?)
        """, 
            (
                orderID,
                uuid,
                prodName,
                status,
                trackCode,
                estDelivery,
                carrier,
                source,
                dateAdded
            )
        )
        con.commit()
    except:
        raise Exception("Error occurred when trying to insert order.")
    finally:
        con.close()

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

def getOrderInfo(uuid, order_id):
    con = sql.connect(DB_PATH)
    con.row_factory = sql.Row
    cur = con.cursor()

    try:
        cur.execute("""
            SELECT * FROM "Order"
            WHERE "Order".user = ? AND "Order".orderID = ?
        """, (uuid, order_id))
        order = cur.fetchone()

        return order
    except:
        raise Exception(f"Error occured when trying to retrieve order {order_id} from user '{uuid}'.")
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
