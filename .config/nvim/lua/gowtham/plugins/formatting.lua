return {
  "stevearc/conform.nvim",
  event = { "BufReadPre", "BufNewFile" },
  enabled = true,
  config = function()
    local conform = require("conform")


    conform.setup({
      formatters_by_ft = {
        javascript = { "prettier" },
        typescript = { "prettier" },
        javascriptreact = { "prettier" },
        typescriptreact = { "prettier" },
        css = { "prettier" },
        html = { "prettier" },
        json = { "prettier" },
        yaml = { "prettier" },
        markdown = { "prettier" },
        scss = { "prettier" },
        java = { "google_java_format" },
      },
      formatters = {
        google_java_format = {
          command = "java",
          args = {
            "-jar", vim.fn.expand("~/.local/bin/google-java-format.jar"),
            "--aosp" -- Optional: Makes it closer to IntelliJ's defaults
          },
          stdin = true,
        },
      },
      format_after_save = {
        lsp_format = "fallback",
      },
    })

    vim.keymap.set({ "n", "v" }, "<leader>mp", function()
      conform.format({
        lsp_fallback = true,
        async = false,
        timeout_ms = 1000,
      })
    end, { desc = "Format file or range (in visual mode)" })
  end,
}
