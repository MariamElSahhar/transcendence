PYTHON_ENV := python

# DOCKER
docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

# LOCAL
run-frontend:
	cd frontend && ENV=dev http-server -P http://localhost:8080? -c-1

run-backend:
	ENV=dev $(PYTHON_ENV) backend/manage.py runserver

run-db:
	docker-compose up db

migrate:
	$(PYTHON_ENV) backend/manage.py migrate

pip-install:
	pip install -r backend/requirements.txt

pip-freeze:
	pip freeze > backend/requirements.txt
