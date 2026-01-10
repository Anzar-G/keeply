#!/bin/bash

# Keep-Alive Script for Render Free Tier
# This script pings the app every 10 minutes to prevent cold start

URL="https://keeply-i2wa.onrender.com"
INTERVAL=600  # 10 minutes in seconds

echo "🚀 Starting Keep-Alive Service for $URL"
echo "⏰ Ping interval: $INTERVAL seconds (10 minutes)"
echo "---"

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Ping the homepage
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
    
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo "✅ [$TIMESTAMP] Ping successful (HTTP $HTTP_CODE)"
    else
        echo "⚠️  [$TIMESTAMP] Ping failed (HTTP $HTTP_CODE)"
    fi
    
    # Wait for next interval
    sleep $INTERVAL
done
