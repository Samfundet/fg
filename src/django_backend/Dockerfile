FROM python:3.6

MAINTAINER Jamawadi Noor (jamawadi@gmail.com)

# The entire OS will have these installed
# Uncomment if you want to debug from within the container
#RUN apt-get update && apt-get install -y \
#    curl \
#    vim

# Copy files from actual computer to a folder named root
RUN mkdir /django
ADD . /django
#RUN mkdir /logs TODO logging
#RUN mkdir /logs/nginx
#RUN mkdir /var/log/uwsgi/
#RUN touch /var/log/uwsgi/django_fg.log
WORKDIR /django
RUN pip3 install -r requirements.txt

CMD ["uwsgi", "--ini", "uwsgi.ini"]
