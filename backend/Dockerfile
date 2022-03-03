# -----------------------------------------------------
FROM python:3.9 as requirements_builder
WORKDIR /app
RUN pip install --no-cache-dir poetry
COPY poetry.lock pyproject.toml ./
RUN poetry export --without-hashes -f requirements.txt -o requirements.txt
RUN poetry export --without-hashes --dev -f requirements.txt -o requirements_dev.txt

# Update requirements_dev.txt to contain ONLY dev (not prod+dev)
RUN grep -Fxvf requirements.txt requirements_dev.txt > requirements_dev_new.txt && mv requirements_dev_new.txt requirements_dev.txt
# -----------------------------------------------------


# -----------------------------------------------------
FROM python:3.9
WORKDIR /app
COPY --from=requirements_builder /app/requirements*.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV DJANGO_SETTINGS_MODULE=backend.settings.prod