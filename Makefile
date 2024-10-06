PYTHON_ENV := python

# DOCKER
docker-up:
	docker compose up --build

docker-down:
	docker compose down

# LOCAL
run-frontend:
	cd frontend && ENV=dev http-server -P http://localhost:8080? -c-1

run-backend:
	ENV=dev $(PYTHON_ENV) backend/manage.py migrate
	ENV=dev $(PYTHON_ENV) backend/manage.py runserver

run-db:
	docker compose up db

install:
	pip install -r backend/requirements.txt

freeze:
	pip freeze > backend/requirements.txt

migrate:
	ENV=dev $(PYTHON_ENV) backend/manage.py makemigrations
