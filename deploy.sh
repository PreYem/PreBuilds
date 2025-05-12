#!/bin/bash
set -e  # Exit on error

echo "Resetting deploy.sh to avoid Git conflicts..."
git checkout -- deploy.sh

echo "Pulling latest changes..."
# Start the ssh-agent and add the private key with the passphrase 
echo "Starting SSH agent..."
eval $(ssh-agent -s)

echo "reseting all changes"
git reset --hard
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



echo "Setting up Node.js environment..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


# Build frontend
echo "Building frontend..."
if [ -d "$FRONTEND_SRC" ]; then
    echo "current directory is :"
    pwd
    cd "$FRONTEND_SRC"
    echo "current directory is :"
    pwd
    node -v
    # echo "Running npm install"
    # npm install || { echo "npm install failed"; exit 1; } 
    echo "Running npm build"

    # Try build up to 3 times
    for i in {1..3}; do
    echo "Build attempt $i of 3"
    npm run build && break || {
        echo "Build failed, retrying in 5 seconds..."
        sleep 5
    }
    done
    
    if [ ! -d "$FRONTEND_SRC/dist" ]; then
        echo "Build directory not found. Check your build configuration."
        exit 1
    fi
else
    echo "Frontend source directory not found."
    exit 1
fi


# Or directly specify the Node.js path if you know it
# export PATH="/path/to/node/bin:$PATH"

# Verify Node.js is available
node -v
npm -v

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