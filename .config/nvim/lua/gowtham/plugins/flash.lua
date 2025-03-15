return {
  {
    "folke/flash.nvim",
    event = "VeryLazy",
    opts = {
      modes = {
        char = {
          enabled = false,               -- disable character mode entirely
          keys = { 'f', 'F', 't', 'T' }, -- explicitly disable these keys
        },
      },
    },
    keys = {
      {
        "s",
        mode = { "n", "x", "o" },
        function() require("flash").jump() end,
        desc = "Flash Jump"
      },
      -- {
      --   "S",
      --   mode = { "n", "x", "o" },
      --   function() require("flash").treesitter() end,
      --   desc = "Flash Treesitter"
      -- },
    },
  },
}
