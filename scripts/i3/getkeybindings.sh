
#!/bin/bash

# i3wm Keybindings
echo "# i3wm Keybindings" > ~/keybindings.txt
grep 'bindsym' ~/.config/i3/config >> ~/keybindings.txt

# tmux Keybindings
echo -e "\n# tmux Keybindings" >> ~/keybindings.txt
tmux list-keys >> ~/keybindings.txt

# Neovim Keybindings
echo -e "\n# Neovim Keybindings" >> ~/keybindings.txt
nvim --headless +':redir @a | silent map | redir END | let @" | put a | q!' -c 'q!' >> ~/keybindings.txt

cat ~/keybindings.txt
