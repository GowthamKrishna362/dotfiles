return {
  "nvim-telescope/telescope.nvim",
  branch = "0.1.x",
  dependencies = {
    "nvim-lua/plenary.nvim",
    { "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
    "nvim-tree/nvim-web-devicons",
    "nvim-telescope/telescope-live-grep-args.nvim", -- Add the live grep args extension here
  },
  config = function()
    local telescope = require("telescope")
    local actions = require("telescope.actions")
    local builtin = require("telescope.builtin")
    local action_state = require("telescope.actions.state")
    local custom_actions = require("gowtham.plugins.telescope.custom_actions.custom_functions")


    telescope.setup({
      defaults = {
        path_display = { "smart" },
        mappings =
        {
          i = {
            ["<TAB>"] = actions.toggle_selection,
            ["<C-k>"] = actions.move_selection_previous,
            ["<C-j>"] = actions.move_selection_next,
            ["<esc>"] = actions.close

          },
          n = {
            ["<TAB>"] = actions.toggle_selection,
            ["<S-CR>"] = actions.select_vertical,
            ["sv"] = actions.select_vertical,
            ["sh"] = actions.select_horizontal,
            ["<esc>"] = actions.close,
            ["msv"] = custom_actions.multi_selection_open_vsplit,
            ["msh"] = custom_actions.multi_selection_open_split,
            ["mst"] = custom_actions.multi_selection_open_tab,
          },
        },
      },
      pickers = {
        oldfiles = {
          max_results = 10,
        },
        buffers = {
          sort_lastused = true,
        }
      },
      extensions = {
        fzf = {}
      }
    })


    telescope.load_extension("fzf")
    telescope.load_extension("live_grep_args")

    local live_grep_args = telescope.extensions.live_grep_args


    local keymap = vim.keymap

    keymap.set("n", "<leader>fb", builtin.buffers, { desc = "Fuzzy find buffers" })
    keymap.set("n", "<leader><leader>", builtin.find_files, { desc = "Fuzzy find files in cwd" })
    keymap.set("n", "<leader>fr", builtin.oldfiles, { desc = "Fuzzy find recent files" })
    keymap.set("n", "<leader>fs", live_grep_args.live_grep_args, { desc = "Find string in cwd" })
    keymap.set('n', '<leader>fw', function()
      builtin.grep_string({ search = vim.fn.expand('<cword>') })
    end, { desc = "Search word under cursor" })
    keymap.set("n", "<leader>fc", builtin.grep_string, { desc = "Find string under cursor in cwd" })
    keymap.set("n", "<leader>/", builtin.current_buffer_fuzzy_find, { desc = "Search in current buffer" })
    keymap.set('v', '<leader>fw', custom_actions.grep_selected_string, {})
    keymap.set('v', '<leader>/', custom_actions.grep_selected_string_in_buffer, {})
  end,
}
