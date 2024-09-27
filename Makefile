PYTHON_ENV := python

# DOCKER
docker-up:
	docker-compose up --build

docker-clean:
	docker-compose down

# LOCAL
run-frontend:
	cd frontend && http-server -P http://localhost:8080? -c-1

run-backend:
	DJANGO_ENV=dev $(PYTHON_ENV) backend/manage.py runserver

run-db:
	docker-compose up db

migrate:
	$(PYTHON_ENV) backend/manage.py migrate

pip-install:
	pip install -r backend/requirements.txt

pip-freeze:
	pip freeze > backend/requirements.txt
