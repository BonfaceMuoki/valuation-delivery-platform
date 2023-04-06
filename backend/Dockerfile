FROM php:8.1-fpm
# Install Dependencies
RUN apt-get update && apt-get install -y git curl libpng-dev libonig-dev libxml2-dev zip unzip

#install some base extensions
RUN apt-get install -y \
    libzip-dev \
    zip \
    zlib1g-dev\
    && docker-php-ext-install zip \
    && docker-php-ext-install gd
# Clear Cache
# Install PHP extensions
RUN docker-php-ext-install sockets pdo_mysql intl mbstring exif pcntl bcmath gd

#Install Node Js and Npm
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

RUN apt-get install -y nodejs
# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /app/backend

COPY . .
RUN composer install
EXPOSE 8000
CMD php artisan serve --host=0.0.0.0

