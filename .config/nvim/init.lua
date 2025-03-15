require("gowtham.core")
require("gowtham.lazy")


vim.api.nvim_create_autocmd('TextYankPost', {
  callback = function()
    vim.highlight.on_yank({ higroup = 'IncSearch', timeout = 200 })
  end,
})

vim.api.nvim_create_autocmd({ "BufNewFile", "BufRead" }, {
  pattern = "~/.config/i3/*",
  command = "set filetype=i3config",
})
