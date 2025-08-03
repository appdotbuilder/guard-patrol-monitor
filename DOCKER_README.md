# Docker Production Deployment

This repository includes a complete Docker setup for running the Laravel application with React/Inertia.js in production.

## Quick Start

1. **Clone the repository and navigate to the project directory**
2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Set required environment variables**:
   ```bash
   # Generate application key
   php artisan key:generate

   # Set your environment variables
   APP_KEY=your-generated-key-here
   DB_PASSWORD=your-secure-database-password
   REDIS_PASSWORD=your-secure-redis-password
   ```

4. **Build and run**:
   ```bash
   docker-compose up -d --build
   ```

5. **Run migrations**:
   ```bash
   docker-compose exec app php artisan migrate --force
   ```

## Architecture

The Docker setup uses a multi-stage build process:

- **Stage 1**: Builds frontend assets using Node.js
- **Stage 2**: Sets up PHP base with required extensions
- **Stage 3**: Installs dependencies and builds the application
- **Stage 4**: Production runtime with nginx + php-fpm

## Services

- **app**: Laravel application with nginx and php-fpm
- **postgres**: PostgreSQL database
- **redis**: Redis for caching and sessions

## Production Environment Variables

Create a `.env` file with these essential variables:

```env
# Application
APP_NAME="Your App Name"
APP_ENV=production
APP_KEY=base64:your-32-character-key-here
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=your-secure-password

# Cache & Sessions
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=your-redis-password
REDIS_PORT=6379
```

## Security Considerations

- All sensitive functions are disabled in PHP-FPM
- Security headers are configured in nginx
- OPcache is enabled for optimal performance
- Error display is disabled in production
- Strong session security is enforced

## Performance Optimizations

- OPcache enabled with production settings
- Gzip compression enabled
- Static asset caching (1 year)
- Optimized PHP-FPM worker configuration
- Realpath cache configured

## Health Checks

The application includes health checks for all services:
- App: HTTP health check endpoint at `/health`
- PostgreSQL: Connection test
- Redis: Ping test

## Deployment Commands

```bash
# Build only the application image
docker build -t your-app .

# Run with custom environment file
docker-compose --env-file .env.production up -d

# View logs
docker-compose logs -f app

# Run artisan commands
docker-compose exec app php artisan migrate
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache
docker-compose exec app php artisan view:cache

# Scale the application
docker-compose up -d --scale app=3
```

## Volumes

- `postgres_data`: PostgreSQL data persistence
- `redis_data`: Redis data persistence
- `storage`: Laravel storage directory
- `logs`: Application logs

## Ports

- **80**: Application (HTTP)
- Configure SSL termination with a reverse proxy like nginx or Traefik

## Monitoring

Access logs are available at:
- nginx: `/var/log/nginx/`
- PHP-FPM: `/var/log/supervisor/`
- Laravel: `/var/www/html/storage/logs/`

## Troubleshooting

1. **Permission issues**: Ensure storage directories are writable
2. **Database connection**: Check if PostgreSQL service is healthy
3. **Redis connection**: Verify Redis password configuration
4. **Assets not loading**: Ensure Vite build completed successfully

## Production Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure strong passwords
- [ ] Set up SSL certificates
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging
- [ ] Configure queue workers if needed
- [ ] Set up scheduled tasks (cron) 