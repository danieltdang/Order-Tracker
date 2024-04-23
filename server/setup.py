import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

con = psycopg2.connect(
    host="localhost",
    database=os.getenv('POSTGRES_DB'),
    user=os.getenv('POSTGRES_USER'),
    password=os.getenv('POSTGRES_PASSWORD')
)
cur = con.cursor()

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
    orderID SERIAL PRIMARY KEY,
    senderLocation TEXT,
    receiverLocation TEXT,
    productName TEXT,
    status INTEGER,
    trackingCode TEXT,
    estimatedDelivery DATE,
    carrier TEXT,
    source TEXT,
    dateAdded DATE,
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
    "emailID" SERIAL PRIMARY KEY,
    content TEXT,
    source TEXT,
    dateReceived DATE,
    FOREIGN KEY ("order") REFERENCES "Order"(orderID)
)
""")

# An order can also have many order events

cur.execute("""
CREATE TABLE IF NOT EXISTS "OrderEvent"(
    "order" INTEGER,
    "orderEventID" SERIAL PRIMARY KEY,
    description TEXT,
    date DATE,
    FOREIGN KEY ("order") REFERENCES "Order"(orderID)
)
""")

cur.execute("""
CREATE ROLE base_user
""")

cur.execute("""
CREATE ROLE premium_user
""")

cur.execute("""
GRANT SELECT ON "Email" TO premium_user;
""")

cur.execute("""
REVOKE ALL ON "Email" FROM base_user;
""")

con.commit()
cur.close()
con.close()