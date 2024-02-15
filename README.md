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
npm install
```
- Have the Angular CLI installed: 
```bash
npm install -g @angular/cli
```

### Adding new features

#### Adding service (such as data)
```bash 
ng generate service (name)
```
- This generates `(name).service.spec.ts` and `(name).service.ts` in `src/app`

#### Adding component (such as orders, which hasnt been done yet)
```bash 
ng generate component (name)
```
- This generates `(name).component.css`, `(name).component.html`,`(name).component.spec.ts` and `(name).component.ts` in `src/app/(name)`

### Running the Client
- Go into the client folder in Terminal
```bash
cd client
```
- Run Angular CLI command to serve the client 
```bash
ng serve
```