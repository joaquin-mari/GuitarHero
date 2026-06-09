FROM python:3.13.2

WORKDIR /app

COPY . .

RUN pip install uv

CMD ["uv", "run", "fastapi", "run", "app/main.py"]