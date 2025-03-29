#!/bin/bash
set -e


git reset --hard main
# Path configurations
REPO_DIR="$(pwd)"
FRONTEND_SRC="${REPO_DIR}/prebuilds_frontend"
BACKEND_SRC="${REPO_DIR}/prebuilds_backend"
FRONTEND_DEST="/home/u824026742/domains/prebuilds.shop/public_html" #Where Hostinger is deploying Frontend
BACKEND_DEST="/home/u824026742/domains/api.prebuilds.shop" #Where Hostinger is deploying Backend

echo "Starting deployment process..."
echo "Repository directory: $REPO_DIR"
echo "Frontend source: $FRONTEND_SRC"
echo "Backend source: $BACKEND_SRC"
echo "Frontend destination: $FRONTEND_DEST"
echo "Backend destination: $BACKEND_DEST"

# Backup htaccess files
FRONTEND_HTACCESS="${FRONTEND_DEST}/.htaccess"
BACKEND_HTACCESS="${BACKEND_DEST}/public/.htaccess"

if [ -f "$FRONTEND_HTACCESS" ]; then
    cp "$FRONTEND_HTACCESS" /tmp/frontend_htaccess.bak
    echo "Frontend .htaccess backed up."
fi

if [ -f "$BACKEND_HTACCESS" ]; then
    cp "$BACKEND_HTACCESS" /tmp/backend_htaccess.bak
    echo "Backend .htaccess backed up."
fi

# Pull latest code
echo "Pulling latest code from GitHub..."
# Check if 'github' remote exists, otherwise use 'origin'
if git remote | grep -q "github"; then
    git pull github main
else
    git pull origin main
fi

# Build frontend
echo "Building frontend..."
if [ -d "$FRONTEND_SRC" ]; then
    cd "$FRONTEND_SRC"
    npm install || { echo "npm install failed"; exit 1; }
    npm run build || { echo "npm build failed"; exit 1; }
    
    # Check if build directory exists
    if [ ! -d "$FRONTEND_SRC/dist" ]; then
        echo "Build directory not found. Check your build configuration."
        exit 1
    fi
else
    echo "Frontend source directory not found."
    exit 1
fi

# Deploy frontend
echo "Deploying frontend..."
# Clear destination directory but preserve .htaccess
find "$FRONTEND_DEST" -mindepth 1 -not -name '.htaccess' -delete
# Copy build files to destination
cp -r "$FRONTEND_SRC/dist/"* "$FRONTEND_DEST/"



echo "Frontend deployed."

# Restore frontend .htaccess if it was backed up
if [ -f "/tmp/frontend_htaccess.bak" ]; then
    cp /tmp/frontend_htaccess.bak "$FRONTEND_HTACCESS"
    echo "Frontend .htaccess restored."
fi

# Sync backend while preserving configuration
echo "Syncing backend..."
# Create a list of files/directories to exclude from sync
cat > /tmp/rsync_exclude.txt << EOL
.env
storage/logs/*
storage/app/*
storage/framework/sessions/*
storage/framework/views/*
storage/framework/cache/*
vendor/*
public/.htaccess
bootstrap/cache/*
public/images/*
EOL

# Sync backend files with exclusions
rsync -av --exclude-from=/tmp/rsync_exclude.txt "$BACKEND_SRC/" "$BACKEND_DEST/"
echo "Backend synced."

if [ ! -L "/home/u824026742/domains/prebuilds.shop/public_html/api" ]; then
    echo "Creating symbolic link for 'api' directory..."
    ln -s "$BACKEND_DEST/public" "/home/u824026742/domains/prebuilds.shop/public_html/api" || { echo "Failed to create 'api' symbolic link"; exit 1; }
else
    echo "Symbolic link for 'api' already exists. Skipping creation."
fi


# Restore backend .htaccess if it was backed up
if [ -f "/tmp/backend_htaccess.bak" ]; then
    cp /tmp/backend_htaccess.bak "$BACKEND_HTACCESS"
    echo "Backend .htaccess restored."
fi

# Run composer install in backend destination
echo "Installing backend dependencies..."
cd "$BACKEND_DEST"

echo "Checking composer version."
# Explicitly use php to run composer.phar
php composer.phar --version  # Debugging: Check Composer version
php composer.phar install || { echo "Composer install failed"; exit 1; }


echo "Clearing Laravel cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Deployment completed successfully!"
