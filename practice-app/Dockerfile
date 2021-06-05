FROM python:3.6

ADD app/requirements.txt .
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

ADD app/ /app
WORKDIR /

CMD gunicorn --bind 0.0.0.0:9000 -w 1 app.app:app

EXPOSE 9000