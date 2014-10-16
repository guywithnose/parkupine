FROM guywithnose/node-supervisor

RUN npm install -g grunt-cli

RUN apt-get update && apt-get install -y ruby ruby-dev build-essential w3m
RUN gem install compass

CMD npm install && node_modules/.bin/bower install && grunt serve
