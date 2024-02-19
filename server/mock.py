import sqlite3 as sql

try:
    con = sql.connect("database.db")

    # Inserting fake user
    con.execute("""
        INSERT INTO "User"
        (uuid, firstName, lastName)
        VALUES (?, ?, ?)
    """, ("abcdef", "Samuel", "Anderson"))

    # Inserting a fake order
    con.execute("""
        INSERT INTO "Order"
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
            '123456',
            'abcdef',
            'Yeezys',
            1,
            'TRK123',
            '2024-02-19',
            'UPS',
            'Adidas',
            '2024-02-16'
        )
    )

    con.execute("""
        INSERT INTO email
        ("order", content, dateReceived)
        VALUES (?, ?, ?)
    """, ("123456", "<p>Hi</p>", "2024-02-16"))

    con.execute("""
        INSERT INTO email
        ("order", content, dateReceived)
        VALUES (?, ?, ?)
    """, ("123456", "<p>Bye</p>", "2024-02-18"))
    con.commit()


except sql.IntegrityError as e:
    print(e)
finally:
    # All orders associated with a user
    cur = con.execute("""
        SELECT "User".firstName, Email.content
        FROM Email
        JOIN "Order" ON Email."order" = "Order".orderID
        JOIN "User" ON "Order".user = "User".uuid
    """)
    emails = cur.fetchall()

    for email in emails:
        print(email)

    con.close()
