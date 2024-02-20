import sqlite3 as sql

def getOrdersForUser(uuid):
    con = sql.connect('/tmp/database.db')
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

def getUserInfo(uuid):
    con = sql.connect('/tmp/database.db')
    con.row_factory = sql.Row
    cur = con.cursor()

    try:
        cur.execute("""
            SELECT * FROM "User"
            WHERE "User".uuid = ?
        """, (uuid,))
        orders = cur.fetchone()

        return orders
    except:
        raise Exception(f"Error occured when trying to retrieve info on user '{uuid}'.")
    finally:
        con.close()

def getEmailsForUser(uuid):
    con = sql.connect('/tmp/database.db')
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

