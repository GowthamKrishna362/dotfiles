return {
  "christoomey/vim-tmux-navigator",
  config = function()
    local keymap = vim.keymap
    keymap.set('n', '<M-h>', ':TmuxNavigateLeft<CR>', { silent = true })
    keymap.set('n', '<M-j>', ':TmuxNavigateDown<CR>', { silent = true })
    keymap.set('n', '<M-k>', ':TmuxNavigateUp<CR>', { silent = true })
    keymap.set('n', '<M-l>', ':TmuxNavigateRight<CR>', { silent = true })
  end
}
