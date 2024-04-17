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

        print(f"Removing user {uuid}")

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

        request.body = request.get_json()

        try:
            util.addOrder(
                uuid,
                request.body['prodName'],
                request.body['status'],
                request.body['trackCode'],
                request.body['estDelivery'],
                request.body['carrier'],
                request.body['source'],
                request.body['dateAdded'],
                request.body['senderLocation'],
                request.body['receiverLocation'],
            )
        except sqlite3.Error:
            return jsonify({
                "message": "Error occured when adding order.",
                "status": 400
            }), 400

        return jsonify({
            "message": f"Successfully added order for user {uuid}",
            "status": 201
        }), 201


@app.route('/api/users/<uuid>/orders/<order_id>', methods = ["GET", "DELETE", "PUT"])
def user_order(uuid, order_id):
    if request.method == "GET":
        order = util.getOrderInfo(uuid, order_id)
        if order == None:
            return jsonify({
                "message": "Order not found",
                "status": 404
            }), 404
        return jsonify(dict(order))
    elif request.method == "DELETE":
        if util.removeOrder(order_id):
            return jsonify({
                "message": f"Order #{order_id} successfully removed",
                "status": 200
            }), 200
        else:
            return jsonify({
                "message": "Order not found",
                "status": 404
            }), 404
    elif request.method == "PUT":
        request.body = request.get_json()

        try:
            util.updateOrder(
                order_id,
                request.body['prodName'],
                request.body['status'],
                request.body['trackCode'],
                request.body['estDelivery'],
                request.body['carrier'],
                request.body['source'],
                request.body['dateAdded'],
                request.body['senderLocation'],
                request.body['receiverLocation'],
            )
        except sqlite3.Error:
            return jsonify({
                "message": "Error occured when updating order.",
                "status": 400
            }), 400

        return jsonify({
            "message": f"Successfully updated order {order_id}",
            "status": 201
        }), 201



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

@app.route('/api/users/<uuid>/orders/<order_id>/emails', methods = ["GET", "POST", "DELETE"])
def order_emails(uuid, order_id):
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


@app.route('/api/users/<uuid>/emails/<email_id>', methods = ["DELETE"])
def user_email_by_ID(uuid, email_id):
    if request.method == "DELETE":
        if util.removeEmailByID(email_id):
            return jsonify({
                "message": f"Email #{email_id} successfully removed",
                "status": 200
            })
        else:
            return jsonify({
                "message": "Email not found",
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
    
    res = auth.register_user(first_name, last_name, email, password)
    
    if (res):
        return jsonify({
            "uuid": res['uuid'],
            "userToken": res['token'],
            "status": 200
        }), 200
    
    return jsonify({
        "message": "Internal server error",
        "status": 500
    }), 500

@app.route('/auth/login', methods = ["POST"])
def login_user():
    request.body = request.get_json()

    email = request.body.get('email')
    password = request.body.get('password')

    if (email == None or password == None):
        return jsonify({
            "message": "Email or password not provided",
            "status": 400
        }), 400
    
    res = auth.login_user(email, password)
    
    if (res):
        return jsonify({
            "uuid": res['uuid'],
            "userToken": res['token'],
        }), 200;

    return jsonify({
        "message": "Invalid credentials",
        "status": 401
    }), 401

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
################################
# ORDEREVENT RELATED ENDPOINTS #
################################

@app.route('/api/users/<uuid/orders/<order_id>/events', methods = ["GET", "POST", "DELETE"])
def order_events(uuid, order_id):
    if request.method == "GET":
        orderEvents = [dict(orderEvent) for orderEvent in util.getOrderEventsForOrder(order_id)]

        return jsonify({
            "data": orderEvents,
            "status": 200
        })
    elif request.method == "POST":
        desc = request.form['description']
        date = request.form['date']

        try:
            util.addOrderEvent(
                order_id,
                desc,
                date
            )

            return jsonify({
                "message": f"Successfully created order event.",
                "status": 201
            })
        except Exception as e:
            return jsonify({
                "message": f"Error occured in orderEvent post endpoint: {e}",
                "status": 400
            })
    elif request.method == "DELETE":
        if util.removeOrderEventsForOrder(order_id):
            return jsonify({
                "message": f"Order events for #{order_id} successfully removed",
                "status": 200
            })
        else:
            return jsonify({
                "message": "Order not found (cannot delete events)",
                "status": 404
            })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
