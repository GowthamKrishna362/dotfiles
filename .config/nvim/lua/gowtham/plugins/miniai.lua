return {
  {
    "echasnovski/mini.ai",
    dependencies = { "nvim-treesitter/nvim-treesitter-textobjects" },
    config = function()
      local spec_treesitter = require("mini.ai").gen_spec.treesitter
      require("mini.ai").setup({
        custom_textobjects = {
          f = spec_treesitter { a = "@function.outer", i = "@function.inner" },
          o = spec_treesitter {
            a = { "@block.outer", "@conditional.outer", "@loop.outer" },
            i = { "@block.inner", "@conditional.inner", "@loop.inner" },
          },
        },
      })
    end,
  },
}
