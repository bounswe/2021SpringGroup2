FROM python:3.10

ADD requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ADD . /
WORKDIR /

CMD python manage.py makemigrations authentication && python manage.py makemigrations eventposts && python manage.py migrate && python manage.py runserver 0.0.0.0:9000

EXPOSE 9000