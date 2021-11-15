FROM python:3.6

ADD requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ADD . /
WORKDIR /

CMD python manage.py makemigrations authentication eventposts
CMD python manage.py migrate authentication eventposts
CMD gunicorn --bind 0.0.0.0:9000 -w 1 app.wsgi

EXPOSE 9000