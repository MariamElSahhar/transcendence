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
	$(PYTHON_ENV) backend/manage.py runserver

migrate:
	$(PYTHON_ENV) backend/manage.py migrate
