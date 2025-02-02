return {
  "folke/tokyonight.nvim",
  config = function()
    require("tokyonight").setup({
      style = "moon",
      terminal_colors = true, -- Apply theme to terminal
      -- transparent = true,
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
