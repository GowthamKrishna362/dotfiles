vim.g.mapleader = " "

local keymap = vim.keymap

keymap.set("i", "jk", "<ESC>", { desc = "Exist insert mode" })

-- window management
keymap.set("n", "<leader>sv", "<C-w>v", { desc = "Split window vertically" })                   -- split window vertically
keymap.set("n", "<leader>sh", "<C-w>s", { desc = "Split window horizontally" })                 -- split window horizontally
keymap.set("n", "<leader>se", "<C-w>=", { desc = "Make splits equal size" })                    -- make split windows equal width & height
keymap.set("n", "<leader>sx", "<cmd>close<CR>", { desc = "Close current split" })               -- close current split
keymap.set("n", "<m-x>", "<cmd>close<CR>", { desc = "Close current split" })                    -- close current split

keymap.set("n", "<leader>to", "<cmd>tabnew<CR>", { desc = "Open new tab" })                     -- open new tab
keymap.set("n", "<leader>tx", "<cmd>tabclose<CR>", { desc = "Close current tab" })              -- close current tab
keymap.set("n", "<leader>tn", "<cmd>tabn<CR>", { desc = "Go to next tab" })                     --  go to next tab
keymap.set("n", "<leader>tp", "<cmd>tabp<CR>", { desc = "Go to previous tab" })                 --  go to previous tab
keymap.set("n", "<leader>tf", "<cmd>tabnew %<CR>", { desc = "Open current buffer in new tab" }) --  move current buffer to new tab

keymap.set('n', 'gj', '<C-o>', { noremap = true, silent = true })
keymap.set('n', 'gk', '<C-i>', { noremap = true, silent = true })


-- Resize window using <ctrl> arrow keys
keymap.set("n", "<m-Up>", "<cmd>resize +2<cr>", { desc = "Increase Window Height" })
keymap.set("n", "<m-Down>", "<cmd>resize -3<cr>", { desc = "Decrease Window Height" })
keymap.set("n", "<m-Left>", "<cmd>vertical resize -2<cr>", { desc = "Decrease Window Width" })
keymap.set("n", "<m-Right>", "<cmd>vertical resize +2<cr>", { desc = "Increase Window Width" })

-- dont add curly brackets to jump list
keymap.set('n', '{', '<cmd>keepjumps normal! {<CR>', { noremap = true, silent = true })
keymap.set('n', '}', '<cmd>keepjumps normal! }<CR>', { noremap = true, silent = true })
