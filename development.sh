cyan() { echo "$(tput setaf 6)$*$(tput setaf 9)"; }
red() { echo "$(tput setaf 1)$*$(tput setaf 9)"; }

echo node -v $(node -v)
echo npm -v $(npm -v)
cyan "Make sure node >= 6.9 and npm >= 3"

echo docker-compose stop $(docker-compose stop)
echo docker-compose build $(docker-compose build)
echo docker-compose up -d $(docker-compose up -d)

cyan "Make sure to run 'ng build --watch' in ./src/angular_frontend/"