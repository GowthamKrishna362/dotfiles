return {
  "zbirenbaum/copilot.lua",
  cmd = "Copilot",
  event = "InsertEnter",
  enabled = false,
  config = function()
    require("copilot").setup({
      suggestion = {
        auto_trigger = true,
        hide_during_completion = true,
        debounce = 75,
        keymap = {
          accept = "<C-y>",
        },
      },
    })
  end,
}
