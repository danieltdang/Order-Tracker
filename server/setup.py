import sqlite3 as sql

con = sql.connect('database.db')

# Enable foreign key support
con.execute('PRAGMA foreign_keys = ON')

con.execute("""
CREATE TABLE IF NOT EXISTS "User"(
    uuid TEXT PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    email TEXT,
    password TEXT
)
""")

# A user can have many orders
# but an order can only have
# one associated user

con.execute("""
CREATE TABLE IF NOT EXISTS "Order"(
    user TEXT,
    orderID TEXT PRIMARY KEY,
    productName TEXT,
    status INTEGER,
    trackingCode TEXT,
    estimatedDelivery TEXT,
    carrier TEXT,
    source TEXT,
    dateAdded TEXT,
    FOREIGN KEY (user) REFERENCES "User"(uuid)
)
""")

# An order can have many emails
# but an email can only have
# one associated order

con.execute("""
CREATE TABLE IF NOT EXISTS "Email"(
    "order" TEXT,
    content TEXT,
    dateReceived TEXT,
    FOREIGN KEY ("order") REFERENCES "Order"(orderID)
)
""")

con.commit()
con.close()
