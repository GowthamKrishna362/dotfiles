return {
  "karb94/neoscroll.nvim",
  opts = {},
  config = function()
    require('neoscroll').setup({
      mappings = {
        '<C-u>', '<C-d>',
        '<C-b>', '<C-f>',
        '<C-y>',
      },
      duration_multiplier = 0.5,
    })
  end
}
