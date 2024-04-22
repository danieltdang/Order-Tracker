import psycopg2
from psycopg2.extras import DictCursor

def get_db_connection():
    con = psycopg2.connect(
        host="localhost",
        database="database",
        user="postgres",
        password="password",
    )
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
        
def getUserNameEmail(uuid):
    con = get_db_connection()
    cur = con.cursor(cursor_factory=DictCursor)

    try:
        cur.execute("""
            SELECT firstname, lastname, email FROM "User"
            WHERE "User".uuid = %s
        """, (uuid,))
        user = cur.fetchone()

        return user
    except:
        raise Exception(f"Error occured when trying to retrieve name email on user '{uuid}'.")
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

def get_user_role(uuid):
    con = get_db_connection()
    cur = con.cursor()
    
    try:
        cur.execute("SELECT has_role(%s, %s)", (uuid, 'base_user'))
        is_base_user = bool(cur.fetchone()[0])
        
        if is_base_user:
            return {'role': 'base_user'}
        else:
            cur.execute("SELECT has_role(%s, %s)", (uuid, 'premium_user'))
            is_premium_user = bool(cur.fetchone()[0])
            if is_premium_user:
                return {'role': 'premium_user'}
            else:
                return {'role': 'unknown'}
    finally:
        con.close()

def view_email_table(uuid):
    try:
        con = get_db_connection()
        cur = con.cursor()
        
        query = """
            SELECT has_table_privilege(%s, 'public."Email"', 'SELECT');
        """
        print("Executing query:", query)
        cur.execute(query, (uuid,))
        result = cur.fetchone()[0]
        print("Query result:", result)
        
        cur.close()
        con.close()
        
        return result
    except Exception as e:
        print("Error:", e)
        raise Exception(f"Error occurred when trying to retrieve email hub permission for {uuid}")
    
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

def getOrderStats(uuid, startDate, endDate):
    con = get_db_connection()
    cur = con.cursor()

    statuses = []
    try:
        # Query for the total count of orders by the user
        cur.execute("""
            SELECT COUNT(*) FROM "Order"
            WHERE "Order"."user" = %s AND
            date("Order".dateAdded) BETWEEN date(%s) AND date(%s)
        """, (uuid, startDate, endDate))
        statuses.append(cur.fetchone()[0])

        # Query for the count of emails related to user's orders
        cur.execute("""
            SELECT COUNT(*) FROM "Email"
            JOIN "Order" ON "Email"."order" = "Order".orderid
            WHERE "Order"."user" = %s AND
            date("Order".dateAdded) BETWEEN date(%s) AND date(%s)
        """, (uuid, startDate, endDate))
        statuses.append(cur.fetchone()[0])

        # Using an explicit list of status integers to ensure it matches expected stats
        for status in range(4):
            cur.execute("""
                SELECT COUNT(*) FROM "Order"
                WHERE "Order"."user" = %s AND "Order"."status" = %s AND
                date("Order".dateAdded) BETWEEN date(%s) AND date(%s)
            """, (uuid, status, startDate, endDate))
            statuses.append(cur.fetchone()[0])
            
        return statuses
    except:
        raise Exception(f"Error occured when trying to retrieve stats for user '{uuid}'.")
    finally:
        con.close()

def getOrderStatsList(uuid, startDates, endDates):
    con = get_db_connection()
    cur = con.cursor()

    # Initialize lists for each status count and other counts
    total_orders = []
    total_emails = []
    status_counts = [[] for _ in range(4)]  # list of lists for each status
    
    try:
        for startDate, endDate in zip(startDates, endDates):
            statuses = []
        
            # Query for the total count of orders by the user
            cur.execute("""
                SELECT COUNT(*) FROM "Order"
                WHERE "Order"."user" = %s AND
                date("Order".dateAdded) BETWEEN date(%s) AND date(%s)
            """, (uuid, startDate, endDate))
            total_orders.append(cur.fetchone()[0])

            # Query for the count of emails related to user's orders
            cur.execute("""
                SELECT COUNT(*) FROM "Email"
                JOIN "Order" ON "Email"."order" = "Order".orderid
                WHERE "Order"."user" = %s AND
                date("Order".dateAdded) BETWEEN date(%s) AND date(%s)
            """, (uuid, startDate, endDate))
            total_emails.append(cur.fetchone()[0])
            
            for status in range(4):
                cur.execute("""
                    SELECT COUNT(*) FROM "Order"
                    WHERE "Order"."user" = %s AND "Order"."status" = %s AND
                    date("Order".dateAdded) BETWEEN date(%s) AND date(%s)
                """, (uuid, status, startDate, endDate))
                status_counts[status].append(cur.fetchone()[0])

        return [total_orders, total_emails] + status_counts
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




def getValidOrderIDsForUser(uuid):
    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""
            SELECT "Order".orderID
            FROM "Order"
            JOIN "User" ON "Order"."user" = "User".uuid
            WHERE "User".uuid = %s
        """, (uuid,))
        order_ids = [order_id_tuple[0] for order_id_tuple in cur.fetchall()]

        return order_ids
    except:
        raise Exception(f"Error occured when trying to retrieve orderIDs for user '{uuid}'.")
    finally:
        con.close()

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