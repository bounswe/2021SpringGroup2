FROM python:3.10

ADD requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ADD . /
WORKDIR /

## POSTGRES WAIT SCRIPT FROM https://github.com/ufoscout/docker-compose-wait
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait
CMD /wait && python manage.py makemigrations authentication && python manage.py makemigrations eventposts && python manage.py makemigrations equipmentposts && python manage.py makemigrations profiles  && python manage.py makemigrations badges  &&  python manage.py migrate && python manage.py loaddata badges && python manage.py test  && python manage.py runserver 0.0.0.0:9000

EXPOSE 9000