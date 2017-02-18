FROM python:3.6

MAINTAINER Jamawadi Noor (jamawadi@gmail.com)

# Copy files from actual computer to a folder named django
RUN mkdir /django
COPY . /django

#TODO logging?

WORKDIR /django
RUN pip3 install -r requirements.txt
RUN python manage.py collectstatic --noinput

CMD ["uwsgi", "--ini", "uwsgi.ini"]
