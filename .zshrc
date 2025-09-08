# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH
# source ~/.bash_profile
# Path to your Oh My Zsh installation.
source ~/.zprofile
export ZSH="$HOME/.oh-my-zsh"
PROMPT='%(?:%{$fg_bold[green]%}%1{➜%} :%{$fg_bold[red]%}%1{➜%} ) %{$fg[cyan]%}%~%{$reset_color%} '
plugins=(zsh-autosuggestions zsh-syntax-highlighting z)
source $ZSH/oh-my-zsh.sh
export LC_ALL=en_IN.UTF-8
export LANG=en_IN.UTF-8

function osd() {
  openvpn3 session-manage --session-path "$1" --disconnect
}

# source ~/.bash_profile
eval "$(zoxide init --cmd cd zsh)"
export EDITOR="nvim"
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias cdvimconf="cd ~/dotfiles/.config/nvim/"
alias vimconf="cdvimconf && nvim ."
alias piconf="nvim ~/dotfiles/.config/picom.conf"
alias i3conf="nvim ~/dotfiles/.config/i3"
alias hyconf="nvim ~/dotfiles/.config/hypr/"
alias vim="nvim"
alias v="nvim"
alias startvpn="openvpn3 session-start --config device_1735802922618_gowtham_krishna@komprise_com@komprise.openvpn.com_\[San_Jose_\(CA\)\].ovpn"
alias cdwebr="cd ~/Desktop/Work/Komprise/kpsrc/kdc/director/web-react/"
alias cdkdc="cd ~/Desktop/Work/Komprise/kpsrc/kdc/"
alias install8080="cdkdc && cdkdc && mvn clean install -DskipTests"
alias start8080="cdkdc && mvn cargo:run"
alias start3000="cdwebr && npm start"
alias cdkomp="cd ~/Desktop/Work/Komprise/"
alias cdwork="cd ~/Desktop/Work/"
alias killport='f() { lsof -t -i:$1 | xargs kill -9; }; f'

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
