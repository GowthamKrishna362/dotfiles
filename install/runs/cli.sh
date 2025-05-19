#!/bin/bash

sudo apt install -y zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

sudo apt install alacritty -y
sudo apt install tmux     -y
sudo apt install zoxide   -y

git clone https://github.com/sxyazi/yazi.git
cd yazi
cargo build --release --locked
mv target/release/yazi target/release/ya /usr/local/bin/

LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | \grep -Po '"tag_name": *"v\K[^"]*')
curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/download/v${LAZYGIT_VERSION}/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
tar xf lazygit.tar.gz lazygit
sudo install lazygit -D -t /usr/local/bin/


sudo apt install fzf -y
sudo apt install ripgrep -y 



