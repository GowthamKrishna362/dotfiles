local actions = require("telescope.actions")
local action_state = require("telescope.actions.state")
local builtin = require("telescope.builtin")

local M = {}

function M.grep_selected_string()
  vim.cmd.normal { '"zy', bang = true }
  local selection = vim.fn.getreg("z");
  builtin.grep_string({ default_text = selection });
end

function M.grep_selected_string_in_buffer()
  vim.cmd.normal { '"zy', bang = true }
  local selection = vim.fn.getreg("z");
  builtin.current_buffer_fuzzy_find({ default_text = selection });
end

function M.open_vsplit(prompt_bufnr)
  local selected_entry = action_state.get_selected_entry()
  local filename = selected_entry.filename or selected_entry[1]
  actions.close(prompt_bufnr)
  vim.cmd("vsplit " .. filename)
end

function M.open_hsplit(prompt_bufnr)
  local selected_entry = action_state.get_selected_entry()
  local filename = selected_entry.filename or selected_entry[1]
  actions.close(prompt_bufnr)
  vim.cmd("hsplit " .. filename)
end

function M._multiopen(prompt_bufnr, open_cmd)
  local picker = action_state.get_current_picker(prompt_bufnr)
  local num_selections = #picker:get_multi_selection()
  if not num_selections or num_selections <= 1 then
    actions.add_selection(prompt_bufnr)
  end
  actions.send_selected_to_qflist(prompt_bufnr)
  vim.cmd("cfdo " .. open_cmd)
end

function M.multi_selection_open_vsplit(prompt_bufnr)
  M._multiopen(prompt_bufnr, "vsplit")
end

function M.multi_selection_open_split(prompt_bufnr)
  M._multiopen(prompt_bufnr, "split")
end

function M.multi_selection_open_tab(prompt_bufnr)
  M._multiopen(prompt_bufnr, "tab")
end

function M.multi_selection_open(prompt_bufnr)
  M._multiopen(prompt_bufnr, "edit")
end

return M
