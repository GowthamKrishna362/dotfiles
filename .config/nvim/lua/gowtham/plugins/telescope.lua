return {
  "nvim-telescope/telescope.nvim",
  branch = "0.1.x",
  dependencies = {
    "nvim-lua/plenary.nvim",
    { "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
    "nvim-tree/nvim-web-devicons",
  },
  config = function()
    local telescope = require("telescope")
    local actions = require("telescope.actions")
    local builtin = require("telescope.builtin")
    local action_state = require("telescope.actions.state")


    local telescope_custom_actions = {}

    function telescope_custom_actions._multiopen(prompt_bufnr, open_cmd)
      local picker = action_state.get_current_picker(prompt_bufnr)
      local num_selections = #picker:get_multi_selection()
      if not num_selections or num_selections <= 1 then
        actions.add_selection(prompt_bufnr)
      end
      actions.send_selected_to_qflist(prompt_bufnr)
      vim.cmd("cfdo " .. open_cmd)
    end

    function telescope_custom_actions.multi_selection_open_vsplit(prompt_bufnr)
      telescope_custom_actions._multiopen(prompt_bufnr, "vsplit")
    end

    function telescope_custom_actions.multi_selection_open_split(prompt_bufnr)
      telescope_custom_actions._multiopen(prompt_bufnr, "split")
    end

    function telescope_custom_actions.multi_selection_open_tab(prompt_bufnr)
      telescope_custom_actions._multiopen(prompt_bufnr, "tab")
    end

    function telescope_custom_actions.multi_selection_open(prompt_bufnr)
      telescope_custom_actions._multiopen(prompt_bufnr, "edit")
    end

    telescope.setup({
      defaults = {
        path_display = { "smart" },
        pickers = {
          oldfiles = {
            max_results = 10,
          }
        },
        mappings = {
          i = {
            ["<TAB>"] = actions.toggle_selection,
            ["<C-k>"] = actions.move_selection_previous, -- move to prev result
            ["<C-j>"] = actions.move_selection_next,     -- move to next result
          },
          n = {
            ["<TAB>"] = actions.toggle_selection,
            ["<S-CR>"] = actions.select_tab, -- Remap Shift + Enter to Ctrl + t behavior
            ["msv"] = telescope_custom_actions.multi_selection_open_vsplit,
            ["msh"] = telescope_custom_actions.multi_selection_open_split,
            ["mst"] = telescope_custom_actions.multi_selection_open_tab,
            ["sv"] = function(prompt_bufnr)
              local selected_entry = action_state.get_selected_entry()
              local filename = selected_entry.filename or selected_entry[1]
              actions.close(prompt_bufnr)
              vim.cmd("vsplit " .. filename)
            end,
            ["sh"] = function(prompt_bufnr)
              local selected_entry = action_state.get_selected_entry()
              local filename = selected_entry.filename or selected_entry[1]
              actions.close(prompt_bufnr)
              vim.cmd("split " .. filename)
            end,
          },
        },
      },
      extensions = {
        fzf = {}
      }
    })

    telescope.load_extension("fzf")


    local keymap = vim.keymap -- for conciseness
    keymap.set("n", "<leader>fg", function() builtin.git_files({ use_git_root = false }) end,
      { desc = "Fuzzy find git files in cwd" })
    keymap.set("n", "<leader>fb", function() builtin.buffers({}) end, { desc = "Fuzzy find buffers" })
    keymap.set("n", "<leader><leader>", "<cmd>Telescope find_files<cr>", { desc = "Fuzzy find files in cwd" })
    keymap.set("n", "<leader>fr", "<cmd>Telescope oldfiles<cr>", { desc = "Fuzzy find recent files" })
    keymap.set("n", "<leader>fs", "<cmd>Telescope live_grep<cr>", { desc = "Find string in cwd" })
    keymap.set("n", "<leader>fc", "<cmd>Telescope grep_string<cr>", { desc = "Find string under cursor in cwd" })
    keymap.set("n", "<leader>/", builtin.current_buffer_fuzzy_find, { desc = "Search in current buffer" })
    keymap.set('v', '<leader>fs', function()
      vim.cmd.normal { '"zy', bang = true }
      local selection = vim.fn.getreg("z");
      builtin.grep_string({ default_text = selection });
    end, {})
    keymap.set('v', '<leader>/', function()
      vim.cmd.normal { '"zy', bang = true }
      local selection = vim.fn.getreg("z");
      builtin.current_buffer_fuzzy_find({ default_text = selection });
    end, {})
  end,
}
