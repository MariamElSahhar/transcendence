PYTHON_ENV := python

# DOCKER
docker-up:
	docker compose up --build
	docker-compose watch

docker-down:
	docker compose down

# LOCAL
run-frontend:
	cd frontend && ENV=dev http-server -P http://localhost:80? -c-1 -p 80

run-backend:
	ENV=dev $(PYTHON_ENV) backend/manage.py migrate
	ENV=dev $(PYTHON_ENV) backend/manage.py runserver

run-db:
	docker compose up db

install:
	pip install -r backend/requirements.txt

freeze:
	pip freeze > backend/requirements.txt

makemigrations:
	ENV=dev $(PYTHON_ENV) backend/manage.py makemigrations

migrate:
	ENV=dev $(PYTHON_ENV) backend/manage.py migrate

showmigrations:
	ENV=dev $(PYTHON_ENV) backend/manage.py showmigrations

flush:
	ENV=dev $(PYTHON_ENV) backend/manage.py flush

createsuperuser:
	ENV=dev $(PYTHON_ENV) backend/manage.py createsuperuser

shell:
	ENV=dev $(PYTHON_ENV) backend/manage.py shell
