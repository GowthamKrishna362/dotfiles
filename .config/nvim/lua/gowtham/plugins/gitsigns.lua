return {
  "lewis6991/gitsigns.nvim",
  event = { "BufReadPre", "BufNewFile" },
  enabled = true,
  config = function()
    require('gitsigns').setup {
      on_attach = function(bufnr)
        local gs = package.loaded.gitsigns
        local function map(mode, l, r, opts)
          opts = opts or {}
          opts.buffer = bufnr
          vim.keymap.set(mode, l, r, opts)
        end
      end
    }
    vim.keymap.set("n", "<leader>gp", ":Gitsigns preview_hunk<CR>", { desc = "Preview hunk" })
    vim.keymap.set("n", "<leader>grh", ":Gitsigns reset_hunk<CR>", { desc = "reset hunk" })
    vim.keymap.set("n", "<leader>grb", ":Gitsigns reset_buffer<CR>", { desc = "reset buffer" })
  end,
}
