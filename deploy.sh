#!/bin/bash
set -e  # Exit on error

echo "Resetting deploy.sh to avoid Git conflicts..."
git checkout -- deploy.sh

echo "Pulling latest changes..."
# Start the ssh-agent and add the private key with the passphrase
echo "Starting SSH agent..."
eval $(ssh-agent -s)

# Add SSH private key and passphrase
echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
echo "$SSH_PASSPHRASE" | ssh-add ~/.ssh/id_rsa

# Pull changes from the repository
git pull github main || { echo "Git pull failed"; exit 1; }

echo "Granting execute permission to deploy.sh..."
chmod +x deploy.sh

# Path configurations
REPO_DIR="$(pwd)"
FRONTEND_SRC="${REPO_DIR}/prebuilds_frontend"
BACKEND_SRC="${REPO_DIR}/prebuilds_backend"
FRONTEND_DEST="/home/u824026742/domains/prebuilds.shop/public_html"
BACKEND_DEST="/home/u824026742/domains/api.prebuilds.shop"

echo "Starting deployment process..."
echo "Repository directory: $REPO_DIR"
echo "Frontend source: $FRONTEND_SRC"
echo "Backend source: $BACKEND_SRC"
echo "Frontend destination: $FRONTEND_DEST"
echo "Backend destination: $BACKEND_DEST"

# Backup .htaccess files
FRONTEND_HTACCESS="${FRONTEND_DEST}/.htaccess"
BACKEND_HTACCESS="${BACKEND_DEST}/public/.htaccess"

[ -f "$FRONTEND_HTACCESS" ] && cp "$FRONTEND_HTACCESS" /tmp/frontend_htaccess.bak && echo "Frontend .htaccess backed up."
[ -f "$BACKEND_HTACCESS" ] && cp "$BACKEND_HTACCESS" /tmp/backend_htaccess.bak && echo "Backend .htaccess backed up."

# Build frontend
echo "Building frontend..."
if [ -d "$FRONTEND_SRC" ]; then
    cd "$FRONTEND_SRC"
    npm install || { echo "npm install failed"; exit 1; }
    npm run build || { echo "npm build failed"; exit 1; }
    
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
find "$FRONTEND_DEST" -mindepth 1 -not -name '.htaccess' -delete
cp -r "$FRONTEND_SRC/dist/"* "$FRONTEND_DEST/"
echo "Frontend deployed."

# Restore frontend .htaccess if it was backed up
[ -f "/tmp/frontend_htaccess.bak" ] && cp /tmp/frontend_htaccess.bak "$FRONTEND_HTACCESS" && echo "Frontend .htaccess restored."

# Sync backend while preserving configuration
echo "Syncing backend..."
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

rsync -av --exclude-from=/tmp/rsync_exclude.txt "$BACKEND_SRC/" "$BACKEND_DEST/"
echo "Backend synced."

# Ensure symbolic link exists for API
if [ ! -L "/home/u824026742/domains/prebuilds.shop/public_html/api" ]; then
    echo "Creating symbolic link for 'api' directory..."
    ln -s "$BACKEND_DEST/public" "/home/u824026742/domains/prebuilds.shop/public_html/api" || { echo "Failed to create 'api' symbolic link"; exit 1; }
else
    echo "Symbolic link for 'api' already exists. Skipping creation."
fi

# Restore backend .htaccess if it was backed up
[ -f "/tmp/backend_htaccess.bak" ] && cp /tmp/backend_htaccess.bak "$BACKEND_HTACCESS" && echo "Backend .htaccess restored."

# Run composer install in backend destination
echo "Installing backend dependencies..."
cd "$BACKEND_DEST"
php composer.phar --version
php composer.phar install || { echo "Composer install failed"; exit 1; }

echo "Clearing Laravel cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Deployment completed successfully!"
