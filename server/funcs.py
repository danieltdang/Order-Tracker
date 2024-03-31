import sqlite3 as sql

DB_PATH = 'database.db'



def insertEmail(orderID, content, dateReceived):
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        con.execute("""
            INSERT INTO email
            ("order", content, dateReceived)
            VALUES (?, ?, ?)
        """, (orderID, content, dateReceived))

        con.commit()
    except:
        raise Exception("Error occurred when trying to insert order.")
    finally:
        con.close()


#    con.execute("""
#        INSERT INTO email
#        ("order", content, dateReceived)
#        VALUES (?, ?, ?)
#    """, ("123456", "<p>Hi</p>", "2024-02-16"))
#
#    con.execute("""
#        INSERT INTO email
#        ("order", content, dateReceived)
#        VALUES (?, ?, ?)
#    """, ("123456", "<p>Bye</p>", "2024-02-18"))
#    con.commit()
#
#
#except sql.IntegrityError as e:
#    print(e)
#finally:
#    # All orders associated with a user
#    cur = con.execute("""
#        SELECT "User".firstName, Email.content
#        FROM Email
#        JOIN "Order" ON Email."order" = "Order".orderID
#        JOIN "User" ON "Order".user = "User".uuid
#    """)
#    emails = cur.fetchall()
#
#    for email in emails:
#        print(email)
#
#    con.close()
