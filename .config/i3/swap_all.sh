#!/bin/bash

# Define swap pairs
declare -A pairs=(
  [1]=10
  [2]=12
  [3]=13
  [4]=14
  [5]=15
)

temp_ws=22
tree=$(i3-msg -t get_tree)

# Step 1: move all from `from` → temp
for from in "${!pairs[@]}"; do
  for win in $(echo "$tree" | jq -r ".. | objects | select(.type? == \"con\" and .workspace.name == \"$from\") | .id"); do
    i3-msg "[con_id=$win]" move container to workspace "$temp_ws"
  done
done

# Step 2: move all from `to` → `from`
for from in "${!pairs[@]}"; do
  to=${pairs[$from]}
  for win in $(echo "$tree" | jq -r ".. | objects | select(.type? == \"con\" and .workspace.name == \"$to\") | .id"); do
    i3-msg "[con_id=$win]" move container to workspace "$from"
  done
done

# Step 3: move all from temp → `to`
for from in "${!pairs[@]}"; do
  to=${pairs[$from]}
  for win in $(i3-msg -t get_tree | jq -r ".. | objects | select(.type? == \"con\" and .workspace.name == \"$temp_ws\") | .id"); do
    i3-msg "[con_id=$win]" move container to workspace "$to"
  done
done
