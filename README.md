# LogiTrak

LogiTrak is a web-app used for tracking and managing packages from a variety of different services. Going from service to service to get information on your packages can be a real annoyance, but LogiTrak makes it extremely easy. By scraping the emails of the user, we can get relevant data regarding any orders and populate their feed with useful information. The user can also manually add orders to track at any time.

## Setup

The setup of this project involves two components: client-side and server-side.

### Server-side (Flask)

#### Prerequisites
- Ensure you have `Python` installed on your machine
- Download dependencies for the project by going into the `server` folder using `pip` to install
```bash
cd server
pip install -r requirements.txt
```

#### Running the server
- Use your Python environment on `app.py`, such as with the following command: 
```bash
python app.py
```

### Client-side (Angular)

#### Prerequisites
- Ensure you have NPM (Node Package Manager) installed on your machine.
- Install the packages in the `client` folder used from NPM:
```bash
cd client
npm ci
```

#### Running the Client
- Run Angular CLI command to serve the client 
```bash
npm run ng serve
```
