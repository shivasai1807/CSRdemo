#!/bin/bash

# =========================================================
#  Agent Runner — Git Worktree Multi-Agent Orchestrator
#  v2.0.0
# =========================================================

set -euo pipefail

# ─────────────────────────────────────────────
#  Resolve Paths
# ─────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null)" || {
  echo "❌  Not inside a git repository." >&2
  exit 1
}
REPO_NAME="$(basename "$REPO_ROOT")"

COMMAND="${1:-}"
ARG1="${2:-}"
ARG2="${3:-}"

PORT_FILE="$SCRIPT_DIR/port-registry.json"
LOG_DIR="$SCRIPT_DIR/logs"
AGENTS_BASE="$REPO_ROOT/agents"

mkdir -p "$LOG_DIR"
mkdir -p "$AGENTS_BASE"

# ─────────────────────────────────────────────
#  Colors & Formatting
# ─────────────────────────────────────────────
BOLD="\033[1m"
DIM="\033[2m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
CYAN="\033[0;36m"
RED="\033[0;31m"
BLUE="\033[0;34m"
RESET="\033[0m"

info()    { echo -e "${CYAN}  ℹ  ${RESET}$*"; }
success() { echo -e "${GREEN}  ✔  ${RESET}$*"; }
warn()    { echo -e "${YELLOW}  ⚠  ${RESET}$*"; }
error()   { echo -e "${RED}  ✖  ${RESET}$*" >&2; }
step()    { echo -e "${BLUE}  →  ${RESET}$*"; }
divider() { echo -e "${DIM}────────────────────────────────────────────────${RESET}"; }
header()  { echo -e "\n${BOLD}$*${RESET}"; }

# ─────────────────────────────────────────────
#  ID / Name Generation
# ─────────────────────────────────────────────
generate_short_id() {
  echo "$(date +%M%S)-$(openssl rand -hex 2)"
}

generate_agent_name() {
  echo "agent-$(generate_short_id)"
}

# ─────────────────────────────────────────────
#  Framework Detection
#  All functions print to stdout (return value).
#  Any user-facing messages go to stderr (>&2).
# ─────────────────────────────────────────────
detect_frontend_framework() {
  local path="${1:-$REPO_ROOT}"
  local pkg="$path/package.json"
  if grep -qi '"vite"' "$pkg" 2>/dev/null;           then echo "vite"
  elif grep -qi '"next"' "$pkg" 2>/dev/null;          then echo "next"
  elif grep -qi '"@angular/core"' "$pkg" 2>/dev/null; then echo "angular"
  elif grep -qi '"react"' "$pkg" 2>/dev/null;         then echo "react"
  else echo "unknown"
  fi
}

detect_backend_framework() {
  local path="${1:-$REPO_ROOT}"
  local pkg="$path/package.json"
  if grep -qi '"express"' "$pkg" 2>/dev/null;       then echo "express"
  elif grep -qi '"@nestjs/core"' "$pkg" 2>/dev/null; then echo "nestjs"
  elif grep -qi '"fastify"' "$pkg" 2>/dev/null;      then echo "fastify"
  elif [ -f "$path/requirements.txt" ] && grep -qi "django" "$path/requirements.txt"; then echo "django"
  else echo "unknown"
  fi
}

detect_database_type() {
  local path="${1:-$REPO_ROOT}"
  local pkg="$path/package.json"
  if grep -qi '"mongoose"' "$pkg" 2>/dev/null;   then echo "mongodb"
  elif grep -qi '"pg"' "$pkg" 2>/dev/null;        then echo "postgres"
  elif grep -qi '"mysql"' "$pkg" 2>/dev/null;     then echo "mysql"
  elif grep -qi '"sqlite"' "$pkg" 2>/dev/null;    then echo "sqlite"
  else echo "unknown"
  fi
}

# ─────────────────────────────────────────────
#  Base Port Lookup
# ─────────────────────────────────────────────
get_base_port() {
  case "$1" in
    vite)    echo 5173 ;;
    next)    echo 3000 ;;
    angular) echo 4200 ;;
    react)   echo 3000 ;;
    express) echo 8080 ;;
    nestjs)  echo 3001 ;;
    fastify) echo 3002 ;;
    django)  echo 8000 ;;
    mongodb) echo 27017 ;;
    postgres)echo 5432 ;;
    mysql)   echo 3306 ;;
    sqlite)  echo 0    ;;   # No port for SQLite
    *)       echo 9000 ;;
  esac
}

# ─────────────────────────────────────────────
#  Interactive Port Confirmation
#  Display goes to stderr; only the port echoes to stdout.
# ─────────────────────────────────────────────
confirm_base_port() {
  local framework="$1"
  local suggested
  suggested="$(get_base_port "$framework")"

  echo "" >&2
  echo -e "  ${BOLD}Framework:${RESET} $framework" >&2
  echo -e "  ${BOLD}Suggested port:${RESET} $suggested" >&2
  echo "" >&2

  local confirm
  read -r -p "  Use port $suggested? (y/n): " confirm </dev/tty
  if [[ "$confirm" =~ ^[Yy]$ ]]; then
    echo "$suggested"
  else
    local custom
    read -r -p "  Enter custom port: " custom </dev/tty
    echo "$custom"
  fi
}

# ─────────────────────────────────────────────
#  Registry Initialization
# ─────────────────────────────────────────────
initialize_registry() {
  if [ -f "$PORT_FILE" ]; then
    # Validate existing JSON
    if ! jq empty "$PORT_FILE" 2>/dev/null; then
      warn "Registry JSON is corrupt — reinitializing..."
      rm -f "$PORT_FILE"
    else
      return 0
    fi
  fi

  header "🔧 Initializing Port Registry"
  divider

  local frontend_fw backend_fw database_fw
  frontend_fw="$(detect_frontend_framework "$REPO_ROOT")"
  backend_fw="$(detect_backend_framework "$REPO_ROOT")"
  database_fw="$(detect_database_type "$REPO_ROOT")"

  local frontend_base backend_base database_base
  frontend_base="$(confirm_base_port "$frontend_fw")"
  backend_base="$(confirm_base_port "$backend_fw")"
  database_base="$(confirm_base_port "$database_fw")"

  # Validate ports are numeric
  for port in "$frontend_base" "$backend_base" "$database_base"; do
    if ! [[ "$port" =~ ^[0-9]+$ ]]; then
      error "Invalid port value: '$port'"
      exit 1
    fi
  done

  jq -n \
    --arg ff  "$frontend_fw" \
    --arg bf  "$backend_fw" \
    --arg df  "$database_fw" \
    --argjson fp "$frontend_base" \
    --argjson bp "$backend_base" \
    --argjson dp "$database_base" \
    '{
      frameworkPorts: {
        ($ff): $fp,
        ($bf): $bp,
        ($df): $dp
      },
      agents: []
    }' > "$PORT_FILE"

  divider
  success "Registry initialized → $PORT_FILE"
  echo ""
}

# ─────────────────────────────────────────────
#  Port Allocation
# ─────────────────────────────────────────────
allocate_port() {
  local framework="$1"
  local current
  current="$(jq -r ".frameworkPorts[\"$framework\"] // empty" "$PORT_FILE")"

  local base next
  if [[ -z "$current" || "$current" == "null" ]]; then
    base="$(get_base_port "$framework")"
    next=$((base + 1))
  else
    next=$((current + 1))
  fi

  # Persist incremented port
  local tmp
  tmp="$(mktemp)"
  jq ".frameworkPorts[\"$framework\"] = $next" "$PORT_FILE" > "$tmp" && mv "$tmp" "$PORT_FILE"

  echo "$next"
}

# ─────────────────────────────────────────────
#  Check if Agent Already Running
# ─────────────────────────────────────────────
check_existing_agent() {
  local agent_id="$1"
  local existing
  existing="$(jq -r ".agents[] | select(.id==\"$agent_id\") | .id" "$PORT_FILE" 2>/dev/null)"

  if [[ -n "$existing" && "$existing" != "null" ]]; then
    warn "Agent already registered: $agent_id"
    local frontend_port
    frontend_port="$(jq -r ".agents[] | select(.id==\"$agent_id\") | .frontendPort" "$PORT_FILE")"
    info "Running at → http://localhost:$frontend_port"
    exit 0
  fi
}

# ─────────────────────────────────────────────
#  Worktree Management
# ─────────────────────────────────────────────
create_worktree() {
  local agent_id="$1"
  local branch="$agent_id"
  local worktree_path="$AGENTS_BASE/$agent_id"

  if [ -d "$worktree_path" ]; then
    warn "Worktree already exists — reusing"
    return 0
  fi

  if git -C "$REPO_ROOT" show-ref --verify --quiet "refs/heads/$branch"; then
    step "Found existing local branch → $branch"
    git -C "$REPO_ROOT" worktree add "$worktree_path" "$branch"

  elif git -C "$REPO_ROOT" ls-remote --heads origin "$branch" | grep -q "$branch"; then
    step "Found existing remote branch → origin/$branch"
    git -C "$REPO_ROOT" fetch origin "$branch"
    git -C "$REPO_ROOT" worktree add "$worktree_path" "$branch"

  else
    step "Creating new branch + worktree → $branch"
    git -C "$REPO_ROOT" worktree add -b "$branch" "$worktree_path" main
  fi
}

remove_worktree() {
  local agent_id="$1"
  local worktree_path="$AGENTS_BASE/$agent_id"
  if [ -d "$worktree_path" ]; then
    step "Removing worktree..."
    git -C "$REPO_ROOT" worktree remove "$worktree_path" --force
    success "Worktree removed"
  fi
}

# ─────────────────────────────────────────────
#  Start Agent
# ─────────────────────────────────────────────
start_agent() {
  local agent_name feature_name worktree_path

  feature_name="${ARG2:-}"
  agent_name="${ARG1:-$(generate_agent_name)}"
  local agent_id="$agent_name"

  initialize_registry

  header "🚀 Starting Agent: $agent_id"
  divider

  check_existing_agent "$agent_id"
  create_worktree "$agent_id"

  worktree_path="$AGENTS_BASE/$agent_id"

  if [ ! -d "$worktree_path" ]; then
    error "Worktree directory not found: $worktree_path"
    exit 1
  fi

  # Detect frameworks from the worktree
  local frontend_fw backend_fw database_fw
  frontend_fw="$(detect_frontend_framework "$worktree_path")"
  backend_fw="$(detect_backend_framework "$worktree_path")"
  database_fw="$(detect_database_type "$worktree_path")"

  # Allocate ports
  local frontend_port backend_port database_port
  frontend_port="$(allocate_port "$frontend_fw")"
  backend_port="$(allocate_port "$backend_fw")"
  database_port="$(allocate_port "$database_fw")"

  echo ""
  info "Detected Stack"
  echo -e "  Frontend  : ${BOLD}$frontend_fw${RESET}  → port ${CYAN}$frontend_port${RESET}"
  echo -e "  Backend   : ${BOLD}$backend_fw${RESET}  → port ${CYAN}$backend_port${RESET}"
  echo -e "  Database  : ${BOLD}$database_fw${RESET}  → port ${CYAN}$database_port${RESET}"
  echo ""

  # Install deps if needed
  if [ ! -d "$worktree_path/node_modules" ]; then
    step "Installing dependencies..."
    npm --prefix "$worktree_path" install --silent
    success "Dependencies installed"
  fi

  # Ensure log directory exists (absolute path)
  local log_file="$LOG_DIR/$agent_id.log"
  touch "$log_file"

  step "Starting development server..."

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
  local pid=$!

  # Give server a moment to confirm it started
  sleep 1
  if ! kill -0 "$pid" 2>/dev/null; then
    error "Server process exited immediately — check logs: $log_file"
    exit 1
  fi

  # Register agent in JSON — use --argjson for numeric ports to avoid null
  local tmp
  tmp="$(mktemp)"
  jq \
    --arg    id          "$agent_id" \
    --arg    feature     "$feature_name" \
    --arg    branch      "$agent_id" \
    --arg    repo        "$REPO_NAME" \
    --arg    path        "$worktree_path" \
    --arg    ff          "$frontend_fw" \
    --arg    bf          "$backend_fw" \
    --arg    df          "$database_fw" \
    --argjson fp         "$frontend_port" \
    --argjson bp         "$backend_port" \
    --argjson dp         "$database_port" \
    --argjson pid        "$pid" \
    '.agents += [{
      id:               $id,
      feature:          $feature,
      branch:           $branch,
      repo:             $repo,
      path:             $path,
      frontendFramework: $ff,
      backendFramework:  $bf,
      databaseType:     $df,
      frontendPort:     $fp,
      backendPort:      $bp,
      databasePort:     $dp,
      pid:              $pid,
      startedAt:        (now | todate)
    }]' "$PORT_FILE" > "$tmp" && mv "$tmp" "$PORT_FILE"

  echo ""
  success "Agent started successfully"
  divider
  echo -e "  ${BOLD}Agent ID ${RESET}  :  $agent_id"
  echo -e "  ${BOLD}Branch   ${RESET}  :  $agent_id"
  echo -e "  ${BOLD}Path     ${RESET}  :  $worktree_path"
  echo -e "  ${BOLD}PID      ${RESET}  :  $pid"
  echo ""
  echo -e "  ${BOLD}Frontend ${RESET}  :  ${CYAN}http://localhost:$frontend_port${RESET}  ($frontend_fw)"
  echo -e "  ${BOLD}Backend  ${RESET}  :  ${CYAN}http://localhost:$backend_port${RESET}   ($backend_fw)"
  [[ "$database_fw" != "sqlite" ]] && \
  echo -e "  ${BOLD}Database ${RESET}  :  port $database_port  ($database_fw)"
  echo ""
  echo -e "  ${BOLD}Logs     ${RESET}  :  $log_file"
  divider
  echo ""
}

# ─────────────────────────────────────────────
#  Stop Agent
# ─────────────────────────────────────────────
stop_agent() {
  local agent_id="${ARG1:-}"
  if [[ -z "$agent_id" ]]; then
    error "Usage: ./agent-runner.sh stop <agent-id>"
    exit 1
  fi

  initialize_registry

  local pid
  pid="$(jq -r ".agents[] | select(.id==\"$agent_id\") | .pid" "$PORT_FILE" 2>/dev/null)"

  if [[ -z "$pid" || "$pid" == "null" ]]; then
    error "Agent not found in registry: $agent_id"
    exit 1
  fi

  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid"
    success "Process $pid stopped"
  else
    warn "Process $pid was not running"
  fi

  header "🛑 Agent Stopped: $agent_id"
  divider
  echo ""
  echo -e "  ${BOLD}Choose next action:${RESET}"
  echo ""
  echo "  1)  Merge branch into main"
  echo "  2)  Push branch & open PR"
  echo "  3)  Commit and push it"
  echo "  4)  Stop only — no merge"
  echo ""
  read -r -p "  Your choice [1/2/3/4]: " choice </dev/tty
  echo ""

  local branch="$agent_id"
  case "$choice" in
    1) merge_branch "$branch" ;;
    2) create_pr "$branch"    ;;
    3) commit_and_push "$agent_id" ;;
    4) step "No merge performed" ;;
    *) warn "Invalid choice — skipping merge" ;;
  esac

  remove_worktree "$agent_id"

  local tmp
  tmp="$(mktemp)"
  jq "del(.agents[] | select(.id==\"$agent_id\"))" "$PORT_FILE" > "$tmp" && mv "$tmp" "$PORT_FILE"

  success "Agent removed from registry"
  echo ""
}

# ─────────────────────────────────────────────
#  Stop All Agents
# ─────────────────────────────────────────────
stop_all_agents() {
  initialize_registry

  local count
  count="$(jq '.agents | length' "$PORT_FILE")"

  if [[ "$count" -eq 0 ]]; then
    info "No running agents registered"
    exit 0
  fi

  header "🛑 Stopping All Agents ($count)"
  divider

  while IFS= read -r agent; do
    local pid id
    pid="$(echo "$agent" | jq -r '.pid')"
    id="$(echo "$agent"  | jq -r '.id')"

    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" && success "Stopped: $id (pid $pid)"
    else
      warn "Already stopped: $id"
    fi

    remove_worktree "$id"
  done < <(jq -c '.agents[]' "$PORT_FILE")

  local tmp
  tmp="$(mktemp)"
  jq '.agents = []' "$PORT_FILE" > "$tmp" && mv "$tmp" "$PORT_FILE"

  echo ""
  success "All agents stopped and cleaned up"
  echo ""
}

# ─────────────────────────────────────────────
#  Status
# ─────────────────────────────────────────────
status_agents() {
  initialize_registry

  local count
  count="$(jq '.agents | length' "$PORT_FILE")"

  header "📊 Agent Status"
  divider

  if [[ "$count" -eq 0 ]]; then
    info "No agents currently running"
    echo ""
    return 0
  fi

  echo ""
  while IFS= read -r agent; do
    local id branch ff bf df fp bp dp path pid started
    id="$(echo "$agent"      | jq -r '.id')"
    branch="$(echo "$agent"  | jq -r '.branch')"
    ff="$(echo "$agent"      | jq -r '.frontendFramework')"
    bf="$(echo "$agent"      | jq -r '.backendFramework')"
    df="$(echo "$agent"      | jq -r '.databaseType')"
    fp="$(echo "$agent"      | jq -r '.frontendPort')"
    bp="$(echo "$agent"      | jq -r '.backendPort')"
    dp="$(echo "$agent"      | jq -r '.databasePort')"
    pid="$(echo "$agent"     | jq -r '.pid')"
    started="$(echo "$agent" | jq -r '.startedAt // "unknown"')"

    local status_icon status_text
    if kill -0 "$pid" 2>/dev/null; then
      status_icon="${GREEN}●${RESET}"
      status_text="${GREEN}running${RESET}"
    else
      status_icon="${RED}●${RESET}"
      status_text="${RED}stopped${RESET}"
    fi

    echo -e "  $status_icon  ${BOLD}$id${RESET}  ($status_text)"
    echo -e "     Branch   : $branch"
    echo -e "     PID      : $pid"
    echo -e "     Started  : $started"
    echo -e "     Stack    : $ff / $bf / $df"
    echo -e "     Frontend : ${CYAN}http://localhost:$fp${RESET}"
    echo -e "     Backend  : ${CYAN}http://localhost:$bp${RESET}"
    [[ "$df" != "sqlite" && "$df" != "unknown" ]] && \
    echo -e "     Database : port $dp"
    echo -e "     Logs     : $LOG_DIR/$id.log"
    echo ""
  done < <(jq -c '.agents[]' "$PORT_FILE")

  divider
  echo ""
}

# ─────────────────────────────────────────────
#  Logs
# ─────────────────────────────────────────────
view_logs() {
  local agent_id="${ARG1:-}"
  if [[ -z "$agent_id" ]]; then
    error "Usage: ./agent-runner.sh logs <agent-id>"
    exit 1
  fi

  local log_file="$LOG_DIR/$agent_id.log"
  if [ ! -f "$log_file" ]; then
    error "Log file not found: $log_file"
    exit 1
  fi

  header "📄 Logs — $agent_id"
  divider
  tail -f "$log_file"
}

# ─────────────────────────────────────────────
#  Git Helpers
# ─────────────────────────────────────────────
merge_branch() {
  local branch="$1"
  header "🔀 Merging $branch → main"
  git -C "$REPO_ROOT" checkout main
  git -C "$REPO_ROOT" merge "$branch"
  git -C "$REPO_ROOT" push origin main
  success "Merge completed"
}

create_pr() {
  local branch="$1"
  header "🚀 Pushing $branch for PR"
  git -C "$REPO_ROOT" push origin "$branch"
  local remote_url
  remote_url="$(git -C "$REPO_ROOT" config --get remote.origin.url)"
  echo ""
  info "Open this URL to create a Pull Request:"
  echo -e "  ${CYAN}${remote_url/\.git/}/compare/main...$branch${RESET}"
  echo ""
}

# ─────────────────────────────────────────────
#  Help
# ─────────────────────────────────────────────
show_help() {
  echo ""
  echo -e "${BOLD}  Agent Runner — Git Worktree Orchestrator${RESET}"
  echo ""
  divider
  echo -e "  ${BOLD}USAGE${RESET}"
  echo ""
  echo "  ./agent-runner.sh <command> [args]"
  echo ""
  echo -e "  ${BOLD}COMMANDS${RESET}"
  echo ""
  echo "  start [agent-name] [feature]   Start a new agent (auto-names if omitted)"
  echo "  stop  <agent-id>               Stop an agent and optionally merge/PR"
  echo "  stop-all                       Stop all running agents"
  echo "  status                         Show status of all agents"
  echo "  logs  <agent-id>               Tail live logs for an agent"
  echo ""
  divider
  echo -e "  ${BOLD}EXAMPLES${RESET}"
  echo ""
  echo "  ./agent-runner.sh start"
  echo "  ./agent-runner.sh start agent-gallery feature/new-ui"
  echo "  ./agent-runner.sh stop  agent-gallery"
  echo "  ./agent-runner.sh logs  agent-gallery"
  echo ""
}

# ─────────────────────────────────────────────
#  Command Router
# ─────────────────────────────────────────────
case "$COMMAND" in
  start)    start_agent    ;;
  stop)     stop_agent     ;;
  stop-all) stop_all_agents ;;
  status)   status_agents  ;;
  logs)     view_logs      ;;
  help|--help|-h) show_help ;;
  *)
    error "Unknown command: '${COMMAND:-<none>}'"
    show_help
    exit 1
    ;;
esac
vider
  echo -e "  ${BOLD}EXAMPLES${RESET}"
  echo ""
  echo "  ./agent-runner.sh start"
  echo "  ./agent-runner.sh start agent-gallery feature/new-ui"
  echo "  ./agent-runner.sh stop  agent-gallery"
  echo "  ./agent-runner.sh logs  agent-gallery"
  echo ""
}

# ─────────────────────────────────────────────
#  Command Router
# ─────────────────────────────────────────────
case "$COMMAND" in
  start)    start_agent    ;;
  stop)     stop_agent     ;;
  stop-all) stop_all_agents ;;
  status)   status_agents  ;;
  logs)     view_logs      ;;
  help|--help|-h) show_help ;;
  *)
    error "Unknown command: '${COMMAND:-<none>}'"
    show_help
    exit 1
    ;;
esac
