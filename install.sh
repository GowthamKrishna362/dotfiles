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
<<<<<<< Updated upstream
 code neovim nodejs npm
)

utils=(
  xclip trash-cli lazygit bluez bluez-utils blueman
=======
  code 
  neovim 
  nodejs 
  npm
)

utils=(
  xclip 
  trash-cli 
  lazygit 
  bluez 
  bluez-utils 
  blueman 
  brightnessctl
>>>>>>> Stashed changes
)

misc=(
  ttf-jetbrains-mono-nerd lsof 
)

hyprland=(
  hyprland xdg-desktop-portal-hyprland xdg-desktop-portal-gnome
  pipewire wireplumber
  grim slurp
  hyprlock swww waypaper
)

for pkg in "${base_pkgs[@]}" "${wm_pkgs[@]}" "${cli_tools[@]}" "${dev_tools[@]}" "${utils[@]}" "${misc[@]}" "${hyprland[@]}"; do
  sudo pacman -S --noconfirm --needed "$pkg" || echo "❌ Failed to install $pkg"
done


yay -S --noconfirm google-chrome
yay -S --noconfirm slack-desktop
yay -S --noconfirm hyprshot

sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting



rm ~/.zshrc
rm ~/.bashrc
cd ~/dotfiles/ && stow . 

sudo systemctl enable bluetooth.service
chsh -s $(which zsh)

