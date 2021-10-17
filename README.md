# Museum Management
Museum Management:- Managing the museum creation, deletion, querying etc.

---

### Dependencies

- MongoDB

---

### Exposes

- REST Endpoints
- Refer to /api directory for the documentation on the REST Endpoint

---


### Mandatory Environment Variables

```bash
NODE_ENV=DEV
LOGLEVEL=verbose
OUT_FILE_NAME=output_log.log
ERR_FILE_NAME=error_log.log
LOG_DIR=log
SERVICE_NAME=MuseumManagement
SERVICE_PORT=4000

# MONGODB 
MONGODB_URL=mongodb://localhost:27017
MONGODB_DBNAME=museums
```

### Optional Environment Variables

```bash
MONGODB_USER=root
MONGODB_PASSWORD=password
MONGODb_AUTHENTICATION_DB=admin

SKIP_HEALTH_CHECK=false
```

### Start the server
1. Import museum data in mongodb from json file
    ```bash
   $ mongoimport --jsonArray --db museums --collection museums --file artifacts/museum.json
    ```
   >Note:- Get the museum collection json file in artifact folder
2. Create a .env and copy the mandatory environment variables from README.md file.
3. Install npm modules
    ```bash
   $ npm ci
    ```
4. Run the server 
   ```bash
   $ npm run start
    ```

### NPM Scripts

1. Run the linting
   ```bash
   $ npm run lint
    ```
2. Get linting Reports
    ```bash
   $ npm run lint
    ```
3. Run the test
   ```bash
   $ npm run test
    ```
4. Get test Reports
    ```bash
   $ npm run test-report
    ```
5. Get test coverage
   ```bash
   $ npm run coverage
    ```
   



