# A client-server project template based on a [Django](https://www.djangoproject.com/) backend and [Vue.js 3](https://vuejs.org/) frontend.

## Installation

### Backend
- Install and configure [Poetry](https://python-poetry.org/)

```bash
pip install --user poetry
```

See [Installation](https://python-poetry.org/docs/#installation) for the official guide.

- Install the dependencies using 

```bash
cd backend

# Configure poetry to create a local venv directory
poetry config virtualenvs.in-project true

poetry install
```

- If you are using a new database or one that has never been migrate, just migrate it using the following Django management command:

```bash
python manage.py makemigrations
```

### Frontend

- Install the dependencies using npm (which you get with [Node.js](https://nodejs.org/en/) installation)

```bash
cd frontend
npm install
```

## Development
### Backend
#### Dev server
The dev server can be started with the following command:
```shell
python manage.py runserver
```

#### CORS and CSRF
CORS and CSRF are preconfigured and should work out of the box.

#### Code Style
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)


### Frontend
The dev server can be started with the following command:
```shell
npm run dev
```