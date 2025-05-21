sudo apt install -y zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
chsh -s $(which zsh)

rm ~/.bashrc
rm ~/.zshrc
cd ~/dotfiles/ && stow -R --override=* .
