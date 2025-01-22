return {
  {
    "stevearc/oil.nvim",
    config = function()
      require("oil").setup({
      })
      vim.keymap.set("n", "-", "<cmd>Oil<CR>", { desc = "Toggle file explorer on current file" }) -- toggle file explorer on current file
    end,
  },
}
