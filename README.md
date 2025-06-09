# Connect4-3D Edition
This repository shows the game Connect4-3D with a computer opponent.

### Setup
In this repository frontend and backend is combined. You can find the frontend code in [frontend](frontend/) and the backend code in [backend](backend/). You need to setup both in order to get started.

#### Frontend
Install the dependencies first, then start the development server.
```bash
cd frontend
npm install
npm run start
```

Now one can access the webapp via localhost:3000

#### Backend
It is also required to start the Python FastAPI server for the backend. For setup, please navigate in the subfolder [backend](backend/). Start by creating and activating a new virtual environment.

```bash
virtualenv -p 3.10 .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Install the pre-commit hook:

```bash
pre-commit install
```
After that you can start the uvicorn development server.

```bash
uvicorn app:app --reload
```

Now one can access the api via localhost:8080


#### Further Notes
You should use git commands only via venv shell, since otherwise pytest can not be executed. (Lasse)

Run python scripts (no `.py` extension):

```bash
python -m src.your_script
```
