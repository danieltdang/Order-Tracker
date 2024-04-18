import psycopg2

con = psycopg2.connect(
    host="isilo.db.elephantsql.com",
    database="qkhplpdv",
    user="qkhplpdv",
    password="MPRLThmEO3gFiPHKrX9ajpKo-hSKOLOa"
    )
print("Connected to at isilo.db.elephantsql.com")
cur = con.cursor()

# Enable foreign key support
#cur.execute('PRAGMA foreign_keys = ON')

cur.execute("""
CREATE TABLE IF NOT EXISTS "User" (
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

cur.execute("""
CREATE TABLE IF NOT EXISTS "Order" (
    "user" TEXT,
    orderID INTEGER PRIMARY KEY,
    senderLocation TEXT,
    receiverLocation TEXT,
    productName TEXT,
    status INTEGER,
    trackingCode TEXT,
    estimatedDelivery TEXT,
    carrier TEXT,
    source TEXT,
    dateAdded TEXT,
    FOREIGN KEY ("user") REFERENCES "User"(uuid)
)
""")

# An order can have many emails
# but an email can only have
# one associated order

cur.execute("""
CREATE TABLE IF NOT EXISTS Email (
    subject TEXT,
    STATUS INTEGER,
    "order" INTEGER,
    "emailID" INTEGER PRIMARY KEY,
    content TEXT,
    source TEXT,
    dateReceived TEXT,
    FOREIGN KEY ("order") REFERENCES "Order"(orderID)
)
""")

# An order can also have many order events

cur.execute("""
CREATE TABLE IF NOT EXISTS "OrderEvent"(
    "order" INTEGER,
    "orderEventID" INTEGER PRIMARY KEY,
    description TEXT,
    date TEXT,
    FOREIGN KEY ("order") REFERENCES "Order"(orderID)
)
""")

con.commit()
cur.close()
con.close()