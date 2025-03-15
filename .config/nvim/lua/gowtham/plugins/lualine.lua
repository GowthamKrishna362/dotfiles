return {
  {
    "nvim-lualine/lualine.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    enabled = true,
    config = function()
      require("lualine").setup {
        options = {
          icons_enabled = true,
          theme = "auto",
          section_separators = { left = '', right = '' },
          component_separators = { left = '', right = '' },
        },
        sections = {
          lualine_a = { "mode" },
          lualine_b = { "branch", "diff" },
          lualine_c = { { "filename", path = 1 } },
          lualine_x = { "filetype" },
          lualine_z = { "location" },
        },
      }
    end,
  },
}
