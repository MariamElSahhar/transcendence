FROM python:3

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /code

# Copy and install dependencies first to leverage caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

ENV ENV=production
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
