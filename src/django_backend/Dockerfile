FROM python:3.6

MAINTAINER Jama Noor (jamawadi@gmail.com)

# Copy files from actual computer to a folder named django
RUN mkdir /django
WORKDIR /django
COPY requirements.txt /django
RUN pip install -r requirements.txt

COPY . /django
RUN python manage.py collectstatic --noinput
