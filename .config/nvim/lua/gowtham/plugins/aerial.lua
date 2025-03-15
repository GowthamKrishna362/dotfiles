return {
  {
    "stevearc/aerial.nvim",
    config = function()
      require("aerial").setup({
      })
      vim.keymap.set("n", "<leader>A", "<cmd>AerialToggle!<CR>")
    end,
  },
}
