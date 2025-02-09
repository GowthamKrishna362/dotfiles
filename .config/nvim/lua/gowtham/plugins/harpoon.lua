return {
  'ThePrimeagen/harpoon',
  config = function()
    require("harpoon").setup({
    })
    vim.api.nvim_set_keymap('n', '<Leader>ha', '<Cmd>lua require("harpoon.mark").add_file()<CR>',
      { noremap = true, silent = true })
    vim.api.nvim_set_keymap('n', '<Leader>hh', '<Cmd>lua require("harpoon.ui").toggle_quick_menu()<CR>',
      { noremap = true, silent = true })
    vim.api.nvim_set_keymap('n', '<Leader>1', '<Cmd>lua require("harpoon.ui").nav_file(1)<CR>',
      { noremap = true, silent = true })
    vim.api.nvim_set_keymap('n', '<Leader>2', '<Cmd>lua require("harpoon.ui").nav_file(2)<CR>',
      { noremap = true, silent = true })
    vim.api.nvim_set_keymap('n', '<Leader>3', '<Cmd>lua require("harpoon.ui").nav_file(3)<CR>',
      { noremap = true, silent = true })
    vim.api.nvim_set_keymap('n', '<Leader>4', '<Cmd>lua require("harpoon.ui").nav_file(4)<CR>',
      { noremap = true, silent = true })
  end
}
