PYTHON_ENV := python3

HOST_IP := $(shell ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $$2}' | head -n 1)


# DOCKER
docker-up:
	HOST_IP=$(HOST_IP) docker compose up --build
	docker-compose watch

docker-down:
	docker compose down

# LOCAL
run-frontend:
	cd frontend && ENV=dev http-server . -P http://127.0.0.1:80? -c-1 -p 80 --proxy http:///127.0.0.1:80

run-backend:
	ENV=dev $(PYTHON_ENV) backend/manage.py migrate
	ENV=dev $(PYTHON_ENV) backend/manage.py runserver 0.0.0.0:8000

run-db:
	docker compose up db

install:
	pip3 install -r backend/requirements.txt

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
