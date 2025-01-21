return {
  {
    "nvim-lualine/lualine.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    config = function()
      require("lualine").setup {
        options = {
          icons_enabled = true,
          theme = "auto", -- Change this to your preferred theme
          section_separators = { left = '', right = '' }, -- Arrows for sections
          component_separators = { left = '', right = '' }, -- Thin arrows for components
          disabled_filetypes = {}, -- Exclude certain file types if needed
        },
        sections = {
          lualine_a = { "mode" },
          lualine_b = { "branch", "diff" },
          lualine_c = { { "filename", path = 1 } },
          -- lualine_x = {
          --   {
          --     require("noice").api.statusline.mode.get,
          --     cond = require("noice").api.statusline.mode.has,
          --     color = { fg = "#ff9e64" },
          --   }
          -- },
          lualine_y = { "filetype" },
          lualine_z = { "location" },
        },
      }
    end,
  },
}
