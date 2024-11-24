PYTHON_ENV := python3

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
	pip3 install -r backend/requirements.txt --break-system-packages

freeze:
	pip3 freeze > backend/requirements.txt

makemigrations:
	ENV=dev $(PYTHON_ENV) backend/manage.py makemigrations

migrate:
	ENV=dev $(PYTHON_ENV) backend/manage.py migrate

showmigrations:
	ENV=dev $(PYTHON_ENV) backend/manage.py showmigrations

createsuperuser:
	ENV=dev $(PYTHON_ENV) backend/manage.py createsuperuser

shell:
	ENV=dev $(PYTHON_ENV) backend/manage.py shell
