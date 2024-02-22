from flask import Flask, jsonify
from flask_cors import CORS
import datetime
import util

app = Flask(__name__)
CORS(app)

@app.route('/api/data')
def get_data():
    data = {"message": "Hello from Flask!"}
    return jsonify(data)

@app.route('/api/getOrders')
def get_orders():
    uuid = "12345"
    orders = util.getOrdersForUser(uuid)
    
    orders_list = [dict(order) for order in orders]

    return jsonify(orders_list)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
