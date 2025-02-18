vim.cmd("let g:netrw_liststyle = 3")

local opt = vim.opt

opt.number = true
opt.relativenumber = true

opt.expandtab = true
opt.shiftwidth = 2
opt.smartindent = true
opt.autoindent = true

opt.wrap = false
opt.ignorecase = true

opt.termguicolors = true
-- needed for vim tpipeline
opt.background = "dark"

opt.signcolumn = "yes"

opt.clipboard:append("unnamedplus")

opt.splitright = true
opt.splitbelow = true

opt.undofile = true
opt.undodir = vim.fn.expand("~/.local/share/nvim/undo")

vim.diagnostic.config({
  virtual_text = true,
  signs = false,
  underline = false,
  update_in_insert = false,
})

opt.scrolloff = 8
-- opt.cmdheight = 0

vim.uv.os_setenv("JAVA_HOME", "/usr/lib/jvm/java-17-openjdk-amd64/")
