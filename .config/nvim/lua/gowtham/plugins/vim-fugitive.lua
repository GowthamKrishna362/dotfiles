return {
  {
    "tpope/vim-fugitive",
    keys = {
      { '<leader>gg', function() vim.cmd('vert Git') end, desc = 'git fugitive' },
    }
  },
}
