vim.cmd("let g:netrw_liststyle = 3")

local opt = vim.opt

opt.number = true
opt.relativenumber = true

-- tabs and indentatio:q:n

opt.shiftwidth = 2
opt.expandtab = true
opt.autoindent = true

opt.wrap = false

-- search settings
opt.ignorecase = true

opt.termguicolors = true
opt.background = "dark"
opt.signcolumn = "yes"

opt.clipboard:append("unnamedplus")

opt.splitright = true
opt.splitbelow = true
