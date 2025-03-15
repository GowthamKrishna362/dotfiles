return {
  {
    "stevearc/oil.nvim",
    config = function()
      require("oil").setup({
        view_options = {
          show_hidden = true,
        },
      })
      vim.keymap.set("n", "-", "<cmd>Oil<CR>", { desc = "Toggle file explorer on current file" })
    end,
  },
}
