# Agent Runner Script Updates Summary

This document summarizes the recent improvements made to the `agent-runner.sh` script to enhance safety and framework compatibility.

## 1. Added "Commit and Push" Option

### The Problem
The `stop_agent` function previously ended with `git worktree remove --force`. If a user made changes inside an agent's worktree but forgot to commit them, selecting any of the stop options (Merge, PR, or Stop only) would permanently delete their uncommitted work.

### The Solution
Added a 4th option to the stop menu: **"Commit and push it"**.

### How it Works
1. **Interactive Menu:** Option `3) Commit and push it` was added to the prompt.
2. **Change Detection:** The script uses `git status --porcelain` to check if there are any modified files in the worktree.
3. **Smart Committing:** 
   - Prompts the user for a commit message.
   - Falls back to a default message (`update from agent <id>`) if none is provided.
   - Stages and commits the changes locally.
4. **Push:** Pushes the commits to the remote branch (`origin/<agent_id>`).
5. **Safe Cleanup:** Only removes the worktree after the changes are safely stored remotely.

## 2. Fixed Vite Port Assignment

### The Problem
When starting a new agent, the script assigned a port and logged that the server started on that port (e.g., 1578). However, the actual server was not accessible on that port until manually restarted in a new terminal.
This occurred because the script was using `PORT="$frontend_port" npm run dev`. Vite ignores the `PORT` environment variable by default and requires the port to be explicitly passed as a CLI argument.

### The Solution
Updated the start command logic to conditionally format the command based on the detected framework.

### How it Works
The script now checks the `$frontend_fw` variable. 
- If it's `vite`, it appends `-- --port "$frontend_port"`.
- If it's `angular`, it appends `--port`.
- Otherwise, it falls back to the standard `PORT=...` environment variable.

---

## Code Summary

### 1. New Git Helper: `commit_and_push`
```bash
commit_and_push() {
  local agent_id="$1"
  local worktree_path="$AGENTS_BASE/$agent_id"

  header "💾 Committing changes in $agent_id"

  if [ ! -d "$worktree_path" ]; then
    error "Worktree path not found: $worktree_path"
    return 1
  fi

  # Check for uncommitted changes
  if [[ -n "$(git -C "$worktree_path" status --porcelain)" ]]; then
    step "Changes detected. Preparing to commit..."
    local msg
    read -r -p "  Enter commit message: " msg </dev/tty
    if [[ -z "$msg" ]]; then
      warn "Empty commit message — using default 'update from agent $agent_id'"
      msg="update from agent $agent_id"
    fi

    git -C "$worktree_path" add .
    git -C "$worktree_path" commit -m "$msg"
    success "Local commit created"
  else
    info "No new changes to commit"
  fi

  step "Pushing to origin/$agent_id..."
  git -C "$worktree_path" push origin "$agent_id"
  success "Branch pushed successfully"
}
```

### 2. Updated Menu in `stop_agent`
```bash
  echo "  1)  Merge branch into main"
  echo "  2)  Push branch & open PR"
  echo "  3)  Commit and push it"
  echo "  4)  Stop only — no merge"
  echo ""
  read -r -p "  Your choice [1/2/3/4]: " choice </dev/tty
  
  # ... (case statement updated to match)
```

### 3. Updated Dev Server Launch in `start_agent`
```bash
  # Launch dev server with absolute log path
  (
    cd "$worktree_path"
    if [[ "$frontend_fw" == "vite" ]]; then
      npm run dev -- --port "$frontend_port" >> "$log_file" 2>&1
    elif [[ "$frontend_fw" == "angular" ]]; then
      npm run start -- --port "$frontend_port" >> "$log_file" 2>&1
    else
      PORT="$frontend_port" npm run dev >> "$log_file" 2>&1
    fi
  ) &
```