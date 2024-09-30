# Usage
## Running on Docker
1. Run `make docker-up` in root
2. Access backend on `http://localhost:8000/`
3. Access frontend on `https://localhost/`

## Running locally
### Frontend
1. `make run-frontend`

2. Access through `http://127.0.0.1:8080/`
### Backend and Database
1. Make you activate a Python environment and install the packages in `requirements.txt`
2. `make run-db`

This runs the PostgreSQL container and maps the database to ``data/`` in the repository. `data/` is in `.gitignore` and won't be uploaded to Git.

3. Run `make run-backend`

4. Backend API is available through `http://127.0.0.1:8000/`

