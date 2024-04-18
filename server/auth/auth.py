import jwt
import bcrypt
import os
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import Request
import psycopg2

def get_db_connection():
    con = psycopg2.connect(
        host="isilo.db.elephantsql.com",
        database="qkhplpdv",
        user="qkhplpdv",
        password="MPRLThmEO3gFiPHKrX9ajpKo-hSKOLOa"
    )
    print("Connected to at isilo.db.elephantsql.com")
    return con

load_dotenv()

def register_user(first_name, last_name, email, first_password):

    print(first_name, last_name, email, first_password)

    hashed_password = bcrypt.hashpw(first_password.encode('utf-8'), bcrypt.gensalt())

    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""SELECT * FROM "User" WHERE email = %s""", (email,))

        if cur.fetchone() is not None:
            return None
        
        user_uuid = str(uuid.uuid4())

        cur.execute("""
            INSERT INTO "User"
            (uuid, firstName, lastName, email, password)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_uuid, first_name, last_name, email, hashed_password))
        
        con.commit()

        return {
            "uuid": user_uuid,
            "token": signToken(user_uuid)
        }
    finally:
        con.close()

def login_user(email, password):
    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""SELECT * FROM "User" WHERE email = %s""", (email,))
        user = cur.fetchone()

        if user is None:
            return None

        if bcrypt.checkpw(password.encode('utf-8'), user[4]):           
            return {
                "uuid": user[0],
                "token": signToken(user[0])
            }
    finally:
        con.close()

    return None

def change_password(uuid, old_password, new_password):
    con = get_db_connection()
    cur = con.cursor()

    try:
        cur.execute("""SELECT * FROM "User" WHERE uuid = %s""", (uuid,))
        user = cur.fetchone()

        if user is None:
            return False
                
        if bcrypt.checkpw(old_password.encode('utf-8'), user[4]):
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            cur.execute("""UPDATE "User" SET password = %s WHERE uuid = %s""", (hashed_password, uuid))
            con.commit()
            return True
        else: 
            return False
        
    finally:
        con.close()


def verifyToken(uuid, token):
    try:
        data = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        
        # We check if the paypload decoded contains that of the same uuid passed in from the request
        if data['userID'] != uuid:
            return False
        
        return True
    except Exception as e:
        return False
    
def signToken(user_id):
    expiration_time = datetime.utcnow() + timedelta(days=30)
    payload = {
        'userID': user_id,
        'exp': expiration_time
    }
    
    return jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm='HS256')

export = {
    "verifyToken": verifyToken,
    "signToken": signToken
}

def is_req_valid(uuid, req: Request):
    authorization = req.headers.get('Authorization')

    if not authorization or verifyToken(uuid, authorization):
        return False
    else:
        return True