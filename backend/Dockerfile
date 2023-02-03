# -----------------------------------------------------
FROM python:3.10 as requirements_builder
WORKDIR /app
RUN pip install --no-cache-dir poetry
COPY poetry.* pyproject.toml ./
RUN poetry export --without-hashes --without dev --format requirements.txt --output requirements.txt
# -----------------------------------------------------

# -----------------------------------------------------
FROM python:3.10
WORKDIR /app

ENV PYTHONUNBUFFERED=1

RUN pip install --no-cache-dir gunicorn
COPY --from=requirements_builder /app/requirements*.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN DJANGO_SETTINGS_MODULE=backend.settings.dev python manage.py collectstatic --noinput

ENV DJANGO_SETTINGS_MODULE=backend.settings.prod
