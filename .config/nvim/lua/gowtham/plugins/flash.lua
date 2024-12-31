-- Add this file in the LazyVim plugin folder, e.g., `~/.config/nvim/lua/plugins/flash.lua`
return {
  {
    "folke/flash.nvim",
    event = "VeryLazy", -- Load the plugin lazily
    opts = {
      -- Customize Flash options here (optional)
      modes = {
        char = {
          jump_labels = true, -- Show jump labels
        },
      },
    },
    keys = {
      -- Define your custom keybindings
      {
        "s",
        mode = { "n", "x", "o" },
        function() require("flash").jump() end,
        desc = "Flash Jump"
      },
      {
        "S",
        mode = { "n", "x", "o" },
        function() require("flash").treesitter() end,
        desc = "Flash Treesitter"
      },
    },
  },
}
