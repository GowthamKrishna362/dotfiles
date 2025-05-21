sudo pacman -Syu --noconfirm

# sudo pacman -S --noconfirm --needed base-devel git
# git clone https://aur.archlinux.org/yay-git.git
# cd yay-git
# makepkg -sri --noconfirm

base_pkgs=(
  git curl stow ripgrep python-pip
)

wm_pkgs=(
  i3 i3status python-i3ipc nitrogen rofi dunst picom polybar
)

cli_tools=(
  zsh alacritty tmux zoxide fzf ripgrep
)

dev_tools=(
  neovim nodejs npm
)

utils=(
  xclip trash-cli lazygit
)

for pkg in "${base_pkgs[@]}" "${wm_pkgs[@]}" "${cli_tools[@]}" "${dev_tools[@]}" "${utils[@]}"; do
  sudo pacman -S --noconfirm --needed "$pkg" || echo "❌ Failed to install $pkg"
done

yay -S --noconfirm google-chrome

# rm ~/.zshrc
# rm ~/.bashrc
# cd ~/dotfiles/ && stow . 
#
# sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# chsh -s $(which zsh)
