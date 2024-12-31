return {
  "folke/tokyonight.nvim",
  config = function()
    require("tokyonight").setup({
      style = "moon",         -- Use the 'moon' variant
      transparent = true,     -- Set to true if you want a transparent background
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
