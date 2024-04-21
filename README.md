# LogiTrak

LogiTrak is a web-app used for tracking and managing packages from a variety of different services. Going from service to service to get information on your packages can be a real annoyance, but LogiTrak makes it extremely easy. By scraping the user's emails and extracting package information, LogiTrak creates an organized, chronological structure of orders and their related emails by looking at the emails themselves as well as the tracking numbers. Users also have the ability to add their own orders to keep track of manually; we still provide extra information by looking at the tracking number.

Once registering for an account and logging in, you will be greeted by the dashboard, which provides information on recent packages at a glance. On the left side of the screen is the navigation bar, which will direct you to the different pages of the site. Finally, right of the navigation bar is the content of each page; here you will find discrete information on orders, order emails, etc.

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
