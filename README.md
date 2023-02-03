# A client-server project template based on a [Django](https://www.djangoproject.com/) backend and [Vue.js 3](https://vuejs.org/) frontend.

## Installation

### Backend

- Install and configure [Poetry](https://python-poetry.org/)

```bash
pip install --user poetry

# you may have to add the install folder `%appdata%\Python\Python310\Scripts` to your PATH environment variable (on windows)
```

See [Installation](https://python-poetry.org/docs/#installation) for the official guide.

- Install the dependencies

```bash
cd backend

poetry install

# Then install the pre-commit hooks
pre-commit install
```

- Initialize the database

```bash
python manage.py migrate
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

[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black) [![Imports: isort](https://img.shields.io/badge/%20imports-isort-%231674b1?style=flat&labelColor=ef8336)](https://pycqa.github.io/isort/)

### Frontend

The dev server can be started with the following command:

```shell
npm run dev
```
