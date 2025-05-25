#!/bin/bash

echo -n "Type 'y' to confirm Hyprland exit: "
read -r confirm

if [[ "$confirm" == "exit" ]]; then
  hyprctl dispatch exit
else
  echo "Cancelled."
fi
