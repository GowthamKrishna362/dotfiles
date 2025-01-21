return {
  "folke/tokyonight.nvim",
  config = function()
    require("tokyonight").setup({
      style = "moon",
      transparent = vim.g.transparent_enabled,
      terminal_colors = true, -- Apply theme to terminal
      styles = {
        comments = { italic = true },
        keywords = { italic = true },
        functions = { bold = true },
        variables = {},
      },
    })
    vim.cmd("colorscheme tokyonight")
  end,
}
