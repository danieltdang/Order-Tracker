# Order-Tracker

Order-Tracker is a web-app used for tracking and managing packages from a variety of different services. Going from service to service to get information on your packages can be a real annoyance, but Order-Tracker makes it extremely easy. By scraping the tracking IDs and emails of the user's packages, we can get relevant data regarding any orders and populate their feed with useful information. The user can also manually add orders to track at any time.

## Setup

The setup of this project involves two components: client-side, server-side.

### Server-side (Flask)

#### Prerequisites
- Ensure you have `Python`, `PostgreSQL`, and `pgAdmin` installed on your machine.
- Download dependencies for the project by going into the `server` folder using `pip` to install.
- Update the POSTGRES_DB, POSTGRES_USER, and POSTGRES_PASSWORD fields in `.env` to match your database.
- Setup the initial Postgres database by executing the `setup.py` script.
```bash
cd server
pip install -r requirements.txt
vim .env
py3 setup.py
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

## Libraries used

### Server-side (Python/Flask) 
```py
bcrypt~=4.1.2
blinker~=1.7.0
cffi~=1.16.0
click~=8.1.7
cryptography~=42.0.5
DateTime~=5.4
Flask~=3.0.2
Flask-Cors~=4.0.0
flask_sqlalchemy~=3.1.1
itsdangerous~=2.1.2
Jinja2~=3.1.3
pyJWT~=2.8.0
MarkupSafe~=2.1.5
psycopg2~=2.9.9
pycparser~=2.22
python-dotenv~=1.0.1
pytz~=2024.1
requests~=2.31.0
setuptools~=69.1.0
Werkzeug~=3.0.1
zope.interface~=6.2
```
### Client-side (TypeScript/Angular)
```js
"@angular/animations": ^17.2.0,
"@angular/cdk": ^17.2.1,
"@angular/common": ^17.2.0,
"@angular/compiler": ^17.2.0,
"@angular/core": ^17.2.0,
"@angular/forms": ^17.2.0,
"@angular/platform-browser": ^17.2.0,
"@angular/platform-browser-dynamic": ^17.2.0,
"@angular/platform-server": ^17.2.0,
"@angular/router": ^17.2.0,
"@angular/ssr": ^17.2.0,
"@ngx-pwa/local-storage": ^17.0.0,
"axios": ^1.6.8,
"chart.js": ^4.4.2,
"date-fns": ^3.3.1,
"express": ^4.19.2,
"primeflex": ^3.3.1,
"primeicons": ^6.0.1,
"primeng": ^17.7.0,
"rxjs": ~7.8.0,
"tslib": ^2.6.2,
"zone.js": ~0.14.3
```

## Separation of Work
* `Daniel Dang` - Angular, Flask, Routes, Database
* `Matthew Echenique` - Database, Flask, Role-based Access Control
* `Zachary De Aguiar` - Order Scraper, Flask, Authentication
* `Samuel Anderson` - Flask, Routes, Database
