return {
  "nvim-telescope/telescope.nvim",
  dependencies = {
    "nvim-lua/plenary.nvim",
    { "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
    "nvim-tree/nvim-web-devicons",
    "nvim-telescope/telescope-live-grep-args.nvim",
  },
  config = function()
    local telescope = require("telescope")
    local actions = require("telescope.actions")
    local builtin = require("telescope.builtin")
    local lga_actions = require("telescope-live-grep-args.actions")

    telescope.setup({
      defaults = {
        layout_strategy = 'horizontal',
        layout_config = { width = 0.90 },
        path_display = {
          filename_first = { reverse_directories = false },
          "truncate"
        },
        mappings =
        {
          i = {
            ["<TAB>"] = actions.toggle_selection,
            ["<C-k>"] = actions.move_selection_previous,
            ["<C-j>"] = actions.move_selection_next,
            -- ["<esc>"] = actions.close

          },
          n = {
            ["<TAB>"] = actions.toggle_selection,
            ["<esc>"] = actions.close,
            ["sv"] = actions.select_vertical,
            ["sh"] = actions.select_horizontal,
          },
        },
      },
      pickers = {
        buffers = {
          sort_mru = true,
          ignore_current_buffer = true
        },
      },
      extensions = {
        live_grep_args = {
          mappings = { -- extend mappings
            i = {
              ["<C-d>"] = lga_actions.quote_prompt(),
              ["<C-i>"] = lga_actions.quote_prompt({ postfix = " --iglob " }),
              -- freeze the current list and start a fuzzy search in the frozen list
              ["<C-space>"] = lga_actions.to_fuzzy_refine,
            },
          }
        }
      }
    })


    telescope.load_extension("fzf")
    telescope.load_extension("live_grep_args")

    local keymap = vim.keymap
    local live_grep_args = telescope.extensions.live_grep_args

    keymap.set("n", "<leader><leader>", builtin.find_files, { desc = "Fuzzy find files in cwd" })
    keymap.set("n", "<leader>fb", builtin.buffers, { desc = "Fuzzy find buffers" })
    keymap.set("n", "<leader>fr", builtin.oldfiles, { desc = "Fuzzy find recent files" })
    keymap.set("n", "<leader>fs", live_grep_args.live_grep_args, { desc = "Find string in cwd" })
    keymap.set('n', '<leader>fw', builtin.grep_string, { desc = "Search word under cursor" })
    keymap.set("n", "<leader>f/", builtin.current_buffer_fuzzy_find, { desc = "Search in current buffer" })

    vim.api.nvim_create_user_command("Notes", function()
      builtin.find_files({
        prompt_title = "Search Notes",
        search_dirs = { "~/Desktop/Notes/" },
      })
    end, { desc = "Search through your notes using Telescope" })
  end,
}
