FROM jprjr/php-fpm

USER root
RUN pacman --sync --refresh --noconfirm --noprogressbar --quiet && pacman --sync --noconfirm --noprogressbar --quiet xdebug
ADD timezone.ini /etc/php/conf.d/timezone.ini
ADD xdebug.ini /etc/php/conf.d/xdebug.ini

USER http
