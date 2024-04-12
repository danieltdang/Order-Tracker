import jwt
import bcrypt
import os
import uuid
import sqlite3 as sql
from datetime import datetime, timedelta
from dotenv import load_dotenv

DB_PATH = 'database.db'

load_dotenv()

def register_user(first_name, last_name, email, first_password):

    print(first_name, last_name, email, first_password)

    hashed_password = bcrypt.hashpw(first_password.encode('utf-8'), bcrypt.gensalt())

    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        cur.execute("""SELECT * FROM "User" WHERE email = ?""", (email,))

        if cur.fetchone() is not None:
            return
        
        user_uuid = str(uuid.uuid4())

        cur.execute("""
            INSERT INTO "User"
            (uuid, firstName, lastName, email, password)
            VALUES (?, ?, ?, ?, ?)
        """, (user_uuid, first_name, last_name, email, hashed_password))
        
        con.commit()

        return (user_uuid, signToken(user_uuid))
    finally:
        con.close()

def login_user(email, password):
    con = sql.connect(DB_PATH)
    cur = con.cursor()

    try:
        cur.execute("""SELECT * FROM "User" WHERE email = ?""", (email,))
        user = cur.fetchone()

        if user is None:
            return ("", "")

        if bcrypt.checkpw(password.encode('utf-8'), user[4]):           
            return (user[0], signToken(user[0]))
    finally:
        con.close()

    return ("", "")

def verifyToken(token):
    try:
        jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        return True
    except Exception as e:
        return False
    
def signToken(user_id):
    expiration_time = datetime.utcnow() + timedelta(days=30)
    payload = {
        'userID': user_id,
        'exp': expiration_time
    }
    token = jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm='HS256')
    return token

export = {
    "verifyToken": verifyToken,
    "signToken": signToken
}