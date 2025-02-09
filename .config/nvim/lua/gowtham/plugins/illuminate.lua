return {
  "RRethy/vim-illuminate",
  event = { "BufReadPost", "BufNewFile" },
  config = function()
    require("illuminate").configure({
      modes_allowlist = { 'n', 'i', 'c' },
    })
    vim.keymap.set("n", "]]", function()
      require("illuminate").goto_next_reference()
    end)
    vim.keymap.set("n", "[[", function()
      require("illuminate").goto_prev_reference()
    end)
  end,
}
