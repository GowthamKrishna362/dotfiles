#!/bin/bash

# Make all scripts in runs/ executable
 chmod +x runs/*

# Run first.sh first if it exists and is executable
if [[ -f "runs/first.sh" && -x "runs/first.sh" ]]; then
    echo "Running first.sh..."
    "runs/first.sh"
else
    echo "first.sh not found or not executable, skipping..."
fi

# Execute all scripts except first.sh and last.sh
for script in runs/*; do
    if [[ -f "$script" && -x "$script" && "$script" != "runs/first.sh" && "$script" != "runs/last.sh" ]]; then
        echo "Running $script..."
        "$script"
    fi
done

# Run last.sh last if it exists and is executable
if [[ -f "runs/last.sh" && -x "runs/last.sh" ]]; then
    echo "Running last.sh..."
    "runs/last.sh"
else
    echo "last.sh not found or not executable, skipping..."
fi
