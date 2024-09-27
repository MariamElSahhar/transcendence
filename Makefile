# Define the Python environment
PYTHON_ENV := python

# Build Docker image and run container
docker-up:
	docker-compose up --build

# Run frontend locally using http-server
run-frontend:
	cd frontend && http-server -P http://localhost:8080? -c-1

# Launch Django
run-backend:
	$(PYTHON_ENV) backend/manage.py runserver

# Migrate PostgreSQL databases
migrate:
	$(PYTHON_ENV) backend/manage.py migrate

# Clean up Docker containers
docker-clean:
	docker-compose down
