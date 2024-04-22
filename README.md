# Order-Tracker

Order-Tracker is a web-app used for tracking and managing packages from a variety of different services. Going from service to service to get information on your packages can be a real annoyance, but Order-Tracker makes it extremely easy. By scraping the emails of the user, we can get relevant data regarding any orders and populate their feed with useful information. The user can also manually add orders to track at any time.

### Prerequisites

=======
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

### Running the Server

- Use your Python environment on `app.py`, such as with the following command:

=======
#### Running the server
- Use your Python environment on `app.py`, such as with the following command: 
```bash
python app.py
```

### Client-side (Angular)

### Prerequisites

- Ensure you have `NPM` installed on your machine.
- Install the packages used from NPM:

=======
#### Prerequisites
- Ensure you have NPM (Node Package Manager) installed on your machine.
- Install the packages in the `client` folder used from NPM:
```bash
cd client
npm ci
```

### Running the Client

- Go into the client folder in Terminal

```bash
cd client
```

- Run Angular CLI command to serve the client

=======
#### Running the Client
- Run Angular CLI command to serve the client 
```bash
npm run ng serve
```

### SQL Commands
```
- For creating the function that checks the user role
  CREATE OR REPLACE FUNCTION has_role(user_id VARCHAR, role_name VARCHAR)
  RETURNS BOOLEAN AS $$
DECLARE
    result BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_catalog.pg_auth_members m
        JOIN pg_catalog.pg_roles r ON (m.roleid = r.oid)
        JOIN pg_catalog.pg_authid a ON (a.oid = m.member)
        WHERE a.rolname = user_id AND r.rolname = role_name
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
```
=======
## Information on the Project

<details>
<summary>Libraries used</summary>
<h3>Server-side (Python/Flask)</h3>
<pre><code>bcrypt==4.1.2
blinker==1.7.0
cffi==1.16.0
click==8.1.7
cryptography==42.0.5
DateTime==5.4
Flask==3.0.2
Flask-Cors==4.0.0
itsdangerous==2.1.2
Jinja2==3.1.3
pyJWT~=2.8.0
MarkupSafe==2.1.5
psycopg2==2.9.9
pycparser==2.22
python-dotenv==1.0.1
pytz==2024.1
setuptools==69.1.0
Werkzeug==3.0.1
zope.interface==6.2
</pre></code>
<h3>Client-side (JavaScript/Angular)</h3>
<pre><code>"@angular/animations": "^17.2.0",
"@angular/cdk": "^17.2.1",
"@angular/common": "^17.2.0",
"@angular/compiler": "^17.2.0",
"@angular/core": "^17.2.0",
"@angular/forms": "^17.2.0",
"@angular/google-maps": "^17.3.4",
"@angular/platform-browser": "^17.2.0",
"@angular/platform-browser-dynamic": "^17.2.0",
"@angular/platform-server": "^17.2.0",
"@angular/router": "^17.2.0",
"@angular/ssr": "^17.2.0",
"@ngx-pwa/local-storage": "^17.0.0",
"axios": "^1.6.8",
"chart.js": "^4.4.2",
"date-fns": "^3.3.1",
"express": "^4.19.2",
"primeflex": "^3.3.1",
"primeicons": "^6.0.1",
"primeng": "^17.7.0",
"rxjs": "~7.8.0",
"tslib": "^2.6.2",
"zone.js": "~0.14.3"
</code></pre>
</details>
