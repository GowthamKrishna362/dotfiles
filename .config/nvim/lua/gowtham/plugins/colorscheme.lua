return {
  "folke/tokyonight.nvim",
  config = function()
    require("tokyonight").setup({
      style = "storm",
      transparent = true,
      styles = {
        comments = { italic = true },
        keywords = { italic = true },
        functions = { bold = true },
        variables = {},
      },
    })
    vim.cmd("colorscheme tokyonight")
    vim.api.nvim_set_hl(0, 'LineNrAbove', { fg = '#545c7e', bold = false }) -- More muted blue-gray
    vim.api.nvim_set_hl(0, 'LineNr', { fg = '#545c7e', bold = false })
    vim.api.nvim_set_hl(0, 'LineNrBelow', { fg = '#545c7e', bold = false })
  end,
}
