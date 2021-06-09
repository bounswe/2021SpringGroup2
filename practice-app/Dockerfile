FROM python:3.6

ADD app/requirements.txt .
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

## POSTGRES WAIT SCRIPT FROM https://github.com/ufoscout/docker-compose-wait
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

ADD app/ /app
WORKDIR /

CMD /wait && gunicorn --bind 0.0.0.0:9000 -w 1 app.app:app

EXPOSE 9000