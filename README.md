# Order-Tracker

## Server (Flask)

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

### SQL Commands

- For creating the function that chekcs the user role
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
