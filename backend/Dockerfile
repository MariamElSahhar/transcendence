FROM python:3

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN mkdir /code
WORKDIR /code

COPY . .
RUN pip install -r requirements.txt

ENV DJANGO_ENV=production
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
