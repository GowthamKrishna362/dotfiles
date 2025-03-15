#!/bin/bash

# Make all scripts in runs/ executable
chmod +x runs/*

# Run prereqs.sh first if it exists and is executable
if [[ -f "runs/prereqs.sh" && -x "runs/prereqs.sh" ]]; then
    echo "Running prereqs.sh..."
    "runs/prereqs.sh"
else
    echo "prereqs.sh not found or not executable, skipping..."
fi

# Execute all other scripts except prereqs.sh
for script in runs/*; do
    if [[ -f "$script" && -x "$script" && "$script" != "runs/prereqs.sh" ]]; then
        echo "Running $script..."
        "$script"
    fi
done


cd ~/dotfiles/ && stow -R --override=* .
chsh -s $(which zsh)
