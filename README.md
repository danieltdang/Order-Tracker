# LogiTrak

LogiTrak is a web-app used for tracking and managing packages from a variety of different services. Going from service to service to get information on your packages can be a real annoyance, but LogiTrak makes it extremely easy. By scraping the emails of the user, we can get relevant data regarding any orders and populate their feed with useful information. The user can also manually add orders to track at any time.

### Prerequisites
- Ensure you have `Python` installed on your machine
- Download dependencies for the project by going into the `server` folder using `pip` to install
```bash
cd server
pip install -r requirements.txt
```

### Running the Server
- Use your Python environment on `app.py`, such as with the following command: 
```bash
python app.py
```

## Client (Angular)

### Prerequisites
- Ensure you have `NPM` installed on your machine.
- Install the packages used from NPM:
```bash
npm ci
```

### Running the Client
- Go into the client folder in Terminal
```bash
cd client
```
- Run Angular CLI command to serve the client 
```bash
npm run ng serve
```
