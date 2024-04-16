from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import json
import sqlite3
import util
import auth.auth as auth
import time

app = Flask(__name__)
CORS(app, supports_credentials=True, expose_headers=["Authorization"])

##########################
# MISC ENDPOINTS #
##########################

@app.route('/api/health', methods = ["GET"])
def health():
    return jsonify({
        "message": "OK",
        "status": 200
    })

##########################
# USER RELATED ENDPOINTS #
##########################

@app.route('/api/users/<uuid>', methods = ["GET", "DELETE"])
def user_id(uuid):

    uuid = str(uuid)
    print(uuid)
    
    if not uuid:
        return jsonify({
            "message": "User id not provided",
            "status": 400
        })
    
    authorization = request.headers.get('Authorization')

    if not authorization:
        return jsonify({
            "message": "Authorization token not provided",
            "status": 401
        })
    

    if not auth.verifyToken(uuid, authorization):
        return jsonify({
            "message": "Invalid authorization token",
            "status": 401
        })

    # Get information of specific user
    if request.method == "GET":
        user = util.getUserInfo(uuid)
        if user == None:
            return jsonify({
                "message": "User not found",
                "status": 404
            })
        return jsonify(dict(user))

    # Delete a specific user
    elif request.method == "DELETE":
        if util.removeUser(uuid):
            return jsonify({
                "message": f"User {uuid} successfully removed",
                "status": 200
            })
        else:
            print(f"User {uuid} not found")
            return jsonify({
                "message": "User not found",
                "status": 404
            })

@app.route('/api/users', methods = ["GET", "POST"])
def user():
    # Creating a new user
    if request.method == "POST":
        fn = request.form['firstName']
        ln = request.form['lastName']
        uuid = request.form['uuid']

        try:
            util.addUser(fn, ln, uuid)
        except sqlite3.IntegrityError:
            return jsonify({
                "message": f"User with id {uuid} already exists.",
                "status": 409
            })

        return jsonify({
            "message": "Success",
            "status": 201
        })

    # Getting all users
    elif request.method == "GET":
        users = [dict(u) for u in util.getAllUsers()]

        return jsonify({
            "data": users,
            "status": 200
        })



###########################
# ORDER RELATED ENDPOINTS #
###########################

@app.route('/api/users/<uuid>/orders', methods = ["GET", "POST"])
def user_all_orders(uuid):
    if request.method == "GET":
        orders = [dict(order) for order in util.getOrdersForUser(uuid)]

        return jsonify({
            "data": orders,
            "status": 200
        })
    elif request.method == "POST":
        uuid = request.form['uuid']
        orderID = request.form['orderID']
        prodName = request.form['prodName']
        status = request.form['status']
        trackCode = request.form['trackCode']
        estDelivery = request.form['estDelivery']
        carrier = request.form['carrier']
        source = request.form['source']
        dateAdded = request.form['dateAdded']

        try:
            util.addOrder(
                uuid,
                orderID,
                prodName,
                status,
                trackCode,
                estDelivery,
                carrier,
                source,
                dateAdded
            )
        except sqlite3.IntegrityError:
            return jsonify({
                "message": f"Order with id {orderID} already exists",
                "status": 400
            })

        return jsonify({
            "message": f"Successfully created order {orderID}",
            "status": 201
        })


@app.route('/api/users/<uuid>/orders/<order_id>', methods = ["GET", "DELETE"])
def user_order(uuid, order_id):
    if request.method == "GET":
        order = util.getOrderInfo(uuid, order_id)
        if order == None:
            return jsonify({
                "message": "Order not found",
                "status": 404
            })
        return jsonify(dict(order))
    elif request.method == "DELETE":
        if util.removeOrder(order):
            return jsonify({
                "message": f"Order #{order} successfully removed",
                "status": 200
            })
        else:
            return jsonify({
                "message": "Order not found",
                "status": 404
            })



###########################
# EMAIL RELATED ENDPOINTS #
###########################

@app.route('/api/users/<uuid>/emails', methods = ["GET"])
def user_emails(uuid):
    if request.method == "GET":
        emails = [dict(email) for email in util.getEmailsForUser(uuid)]

        return jsonify({
            "data": emails,
            "status": 200
        })

@app.route('/api/orders/<order_id>/emails', methods = ["GET", "POST", "DELETE"])
def order_emails(order_id):
    if request.method == "GET":
        emails = [dict(email) for email in util.getEmailsForOrder(order_id)]

        return jsonify({
            "data": emails,
            "status": 200
        })
    elif request.method == "POST":
        content = request.form['content']
        dateReceived = request.form['dateReceived']

        try:
            util.addEmail(
                order_id,
                content,
                dateReceived,
            )

            return jsonify({
                "message": f"Successfully created email.",
                "status": 201
            })
        except Exception as e:
            return jsonify({
                "message": f"Error occured in email post endpoint: {e}",
                "status": 400
            })
    elif request.method == "DELETE":
        if util.removeEmailsForOrder(order_id):
            return jsonify({
                "message": f"Emails for #{order_id} successfully removed",
                "status": 200
            })
        else:
            return jsonify({
                "message": "Order not found (cannot delete emails)",
                "status": 404
            })
        
###########################
# AUTHENTICATION ENDPOINTS #
###########################

@app.route('/auth/register', methods = ["POST"])
def register_user():
    request.body = request.get_json()
    first_name = request.body.get('firstName')
    last_name = request.body.get('lastName')
    email = request.body.get('email')
    password = request.body.get('password')
    
    response = auth.register_user(first_name, last_name, email, password)
    
    if (response[0] != ""):
        return jsonify({
            "uuid": response[0],
            "userToken": response[1],
            "status": 200
        })
    
    return jsonify({
        "message": "Internal server error",
        "status": 500
    })

@app.route('/auth/login', methods = ["POST"])
def login_user():
    request.body = request.get_json()

    email = request.body.get('email')
    password = request.body.get('password')

    if (email == None or password == None):
        return jsonify({
            "message": "Email or password not provided",
            "status": 400
        })
    
    response = auth.login_user(email, password)

    if (response[0] != ""):
        return jsonify({
            "uuid": response[0],
            "userToken": response[1],
            "status": 200
        })
    
    return jsonify({
        "message": "Invalid credentials",
        "status": 401
    })
 
@app.route('/auth/change-password', methods = ["POST"])
def change_password():
    request.body = request.get_json()

    uuid = request.body.get('uuid')
    old_password = request.body.get('oldPassword')
    new_password = request.body.get('newPassword')

    print(uuid, old_password, new_password)

    if (uuid == None or old_password == None or new_password == None):
        return jsonify({
            "message": "UUID, old password, or new password not provided",
            "status": 400
        }), 400
    
    userToken = request.headers.get('Authorization')
    print("Received token:", userToken)

    if (not auth.verifyToken(uuid, request.headers.get('Authorization'))):
        return jsonify({
            "message": "Invalid authorization token",
            "status": 401
        }), 401
    
    if (auth.change_password(uuid, old_password, new_password)):
        return jsonify({
            "message": "Password successfully changed",
            "status": 200
        }), 200
    
    return jsonify({
        "message": "Invalid credentials",
        "status": 401
    }), 401

if __name__ == '__main__':
    app.run(debug=True, port=5001)
