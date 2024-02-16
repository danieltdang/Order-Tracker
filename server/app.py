from flask import Flask, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

@app.route('/api/data')
def get_data():
    data = {"message": "Hello from Flask!"}
    return jsonify(data)

@app.route('/api/getOrders')
def get_orders():
    data = [
    {
        "uuid": "5d5408a8-3cb5-4071-afaf-f3154810a140",
        "id": "1",
        "name": "Watermelon",
        "status": 1,
        "trackingCode": "TRACK123",
        "estimatedDelivery": datetime.datetime.now(),
        "carrier": "Carrier 1",
        "source": "Source 1",
        "dateAdded": datetime.datetime.now(),
    },
    {
        "uuid": "421926d5-dc62-4e76-b227-3abfa2a1cdd5",
        "id": "2",
        "name": "Creatine",
        "status": 2,
        "trackingCode": "TRACK246",
        "estimatedDelivery": datetime.datetime.now(),
        "carrier": "Carrier 2",
        "source": "Source 2",
        "dateAdded": datetime.datetime.now(),
    },
    {
        "uuid": "f3a66b7c-6be1-4e31-becc-9bc04fca382c",
        "id": "3",
        "name": "Yeezy 350 V2 Zebra",
        "status": 0,
        "trackingCode": "TRACK369",
        "estimatedDelivery": datetime.datetime.now(),#.strftime("%B %d, %Y %I:%M:%S %p"),
        "carrier": "Carrier 3",
        "source": "Source 3",
        "dateAdded": datetime.datetime.now(),
    }
]
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
