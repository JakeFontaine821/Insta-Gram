#!/bin/bash

npm start &

until nc -z localhost 3000; do
  sleep 0.5
done

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash / Cygwin)
    echo "Windows detected."
    
    # dynamic ip fetch
    LOCAL_IP=$(ipconfig.exe | grep "IPv4" | head -n1 | awk -F: '{print $2}' | tr -d '\r ')

    # load browser
    start chrome --new-window "http://$LOCAL_IP:3000/frame" --start-fullscreen

elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "macOS detected."
 
    open -a "Google Chrome" --new-window --app=http://localhost:3000 --start-fullscreen

elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "Linux detected."

    LOCAL_IP=$(hostname -I | awk '{print $1}')

    chromium --new-window http://localhost:3000/frame --kiosk --no-first-run --simulate-outdated-no-buttons

else
    echo "Unknown OS: $OSTYPE"
fi
