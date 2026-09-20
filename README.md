# 🎮 Terminal Tic-Tac-Toe (Windows PowerShell Style)

A retro-modern web terminal application styled after **Windows Terminal / PowerShell** (inspired by [`hammadshakeelai/cli-chatbot`](https://github.com/hammadshakeelai/cli-chatbot)), running the interactive Tic-Tac-Toe Python game originally created in [`hammadshakeelai/safetynet2`](https://github.com/hammadshakeelai/safetynet2).

Built for desktop and mobile, with **automatic GitHub Pages deployment**.

---

## 🌟 Features

- **Windows Terminal / PowerShell Look & Feel**:
  - Windows 11 titlebar tabs (`>_ Windows PowerShell`) with tab close and window control buttons (`─`, `▢`, `✕`).
  - Realistic PowerShell startup banner and cyan prompt (`PS C:\Users\user>`).
  - Simulated mechanical keyboard typing sounds (synthesized in-browser using Web Audio API — zero audio downloads).
- **Runs Your Python Code**:
  - Auto-executes `python tictactoe_game.py init` upon loading.
  - Faithfully reproduces the exact octothrope grid formatting:
    ```
           *       *      
       x   *       *      
           *       *      
    * * * * * * * * * * * *
           *       *      
           *   o   *      
           *       *      
    * * * * * * * * * * * *
           *       *      
           *       *      
           *       *      
    ```
  - Exact game loop, 1–9 cell mapping, input validation, and winner detection across all 8 lines.
- **🔄 Dedicated Restart Button**:
  - Titlebar **Restart** button resets the game state instantly.
  - Mobile keypad **Restart** shortcut.
  - Keyboard shortcut: `Ctrl+R`.
  - Terminal command: type `restart` or `python tictactoe_game.py`.
- **🤖 Dual Game Modes**:
  - **2-Player (PvP)**: The classic turn-based two-player mode from the original Python script (`user1` vs `user2`).
  - **vs Computer (AI)**: Play against a smart computer opponent (`user2`) that blocks and takes winning moves.
- **📱 Mobile Responsive & Touch Keypad**:
  - Touch-friendly 1–9 numeric keypad for phones and tablets.
  - Fullscreen toggle for distraction-free gaming.
- **🎨 Themes & FX**:
  - Themes: **PowerShell** (Default dark), **Matrix** (Phosphor green), and **Retro** (Amber glow).
  - CRT scanline and monitor vignette overlay.
  - Sound effect toggle (SFX ON/OFF).
- **📄 View Python Code**:
  - Built-in modal to view the exact Python source code (`vscode/tictactoe.py/finalized.py` from `safetynet2`).
  - One-click copy code to clipboard.

---

## 🚀 How to Host on GitHub Pages

This project is pre-configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that deploys directly to GitHub Pages!

### Setup in 3 Quick Steps:

1. **Push this code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: Windows Terminal Tic-Tac-Toe web app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Actions Pages in Settings**:
   - Go to your repository on GitHub.
   - Click **Settings** > **Pages** (left sidebar).
   - Under **Build and deployment** > **Source**, select:
     👉 **GitHub Actions**.

3. **Done!**
   - The included workflow will automatically build and publish your site at:
     `https://<your-username>.github.io/<your-repo-name>/`

---

## 💻 Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm

### Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build Static Distribution
```bash
npm run build
```
The static HTML, CSS, and JS files will be built in the `dist/` directory with relative paths ready to be served anywhere.

---

## 🐍 Run the Python Script in Terminal

The original Python script is saved in the project root as `tictactoe_game.py`:

```bash
python tictactoe_game.py
```

---

## ⌨️ Terminal Commands Reference

When inside the web terminal, you can type:
| Command | Description |
|---|---|
| `1` – `9` | Select cell to mark on the board |
| `python tictactoe_game.py` | Start or restart the Python game |
| `restart` / `reset` | Reset board and start a new round |
| `cat tictactoe_game.py` | Display the Python code directly in the terminal |
| `mode ai` | Switch to single-player vs Computer |
| `mode pvp` | Switch to two-player PvP |
| `ls` / `dir` | List files in current virtual directory |
| `clear` / `cls` | Clear terminal screen (or `Ctrl+L`) |
| `help` | Show command reference |

---

## 📜 Credits

- Python code from [`hammadshakeelai/safetynet2`](https://github.com/hammadshakeelai/safetynet2)
- Terminal design language inspired by [`hammadshakeelai/cli-chatbot`](https://github.com/hammadshakeelai/cli-chatbot)
