sudo pacman -S curl
curl https://files.snehit.dev/pacman-mirrorlist-in > /tmp/pacman-mirrors-in && cat /tmp/pacman-mirrors-in /etc/pacman.d/mirrorlist | sudo tee /etc/pacman.d/mirrorlist

sudo pacman -Syu --noconfirm


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
 code neovim nodejs npm
)

utils=(
  xclip trash-cli lazygit bluez bluez-utils blueman
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
)

misc=(
  ttf-jetbrains-mono-nerd lsof 
)

hyprland=(
  hyprland xdg-desktop-portal-hyprland xdg-desktop-portal-gnome
  waybar
  pipewire pipewire-pulse wireplumber
  grim slurp
  hyprlock swww 
)

for pkg in "${base_pkgs[@]}" "${wm_pkgs[@]}" "${cli_tools[@]}" "${dev_tools[@]}" "${utils[@]}" "${misc[@]}" "${hyprland[@]}"; do
  sudo pacman -S --noconfirm --needed "$pkg" || echo "❌ Failed to install $pkg"
done


yay -S --noconfirm google-chrome
yay -S --noconfirm slack-desktop
yay -S --noconfirm hyprshot
yay -S --noconfirm waypaper


sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting



rm ~/.zshrc
rm ~/.bashrc
cd ~/dotfiles/ && stow . 

sudo systemctl enable bluetooth.service
sudo systemctl enable pipewire pipewire-pulse
chsh -s $(which zsh)

