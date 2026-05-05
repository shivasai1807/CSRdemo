#!/bin/bash

COMMAND=$1
AGENT_NAME=$2
FEATURE_NAME=$3

PORT_FILE="port-registry.json"
LOG_DIR="logs"

mkdir -p $LOG_DIR

# -------------------------------
# 🔢 Get next available port
# -------------------------------
get_next_port() {
  PORT=$(jq '.nextPort' $PORT_FILE)
  NEW_PORT=$((PORT + 1))
  jq ".nextPort = $NEW_PORT" $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE
  echo $PORT
}

# -------------------------------
# ⚠️ Check running agents
# -------------------------------
check_running_agents() {
  COUNT=$(jq '.agents | length' $PORT_FILE)

  if [ "$COUNT" -gt 0 ]; then
    echo "⚠️ WARNING: There are already running agents!"
    echo "👉 Avoid manually switching git branches."
  fi
}

# -------------------------------
# 🧹 Ensure clean state (main branch)
# -------------------------------
ensure_clean_state() {
  CURRENT_BRANCH=$(git branch --show-current)

  if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Switching back to main branch..."
    git checkout main
  fi
}

# -------------------------------
# 🌿 Create or switch branch
# -------------------------------
create_or_switch_branch() {
  BRANCH="feature/$AGENT_NAME/$FEATURE_NAME"

  echo "🔍 Checking branch: $BRANCH"

  if git show-ref --verify --quiet refs/heads/$BRANCH; then
    echo "🔁 Branch exists locally. Switching..."
    git checkout $BRANCH

  elif git ls-remote --heads origin $BRANCH | grep $BRANCH > /dev/null; then
    echo "🌐 Branch exists remotely. Fetching..."
    git fetch origin $BRANCH
    git checkout -b $BRANCH origin/$BRANCH

  else
    echo "🌱 Creating new branch..."
    git checkout -b $BRANCH
  fi
}

# -------------------------------
# 🚀 Start agent
# -------------------------------
start_agent() {
  if [ -z "$AGENT_NAME" ] || [ -z "$FEATURE_NAME" ]; then
    echo "❌ Missing arguments"
    echo "Usage: ./agent-runner.sh start <agent-name> <feature-name>"
    exit 1
  fi

  echo "🚀 Starting agent: $AGENT_NAME | Feature: $FEATURE_NAME"

  check_running_agents
  ensure_clean_state
  create_or_switch_branch

  PORT=$(get_next_port)
  echo "🔌 Assigned Port: $PORT"

  # Run app
  PORT=$PORT npm run dev > "$LOG_DIR/$AGENT_NAME.log" 2>&1 &

  PID=$!

  # Save agent info
  jq ".agents += [{
    \"agent\":\"$AGENT_NAME\",
    \"feature\":\"$FEATURE_NAME\",
    \"port\":$PORT,
    \"pid\":$PID
  }]" $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE

  echo "✅ Agent running at: http://localhost:$PORT"
  echo "📄 Logs: logs/$AGENT_NAME.log"
}

# -------------------------------
# 🛑 Stop agent
# -------------------------------
stop_agent() {
  if [ -z "$AGENT_NAME" ]; then
    echo "❌ Missing agent name"
    exit 1
  fi

  PID=$(jq -r ".agents[] | select(.agent==\"$AGENT_NAME\") | .pid" $PORT_FILE)

  if [ -z "$PID" ] || [ "$PID" == "null" ]; then
    echo "❌ No running agent found"
    exit 1
  fi

  kill $PID

  jq "del(.agents[] | select(.agent==\"$AGENT_NAME\"))" \
    $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE

  echo "🛑 Agent $AGENT_NAME stopped"
}

# -------------------------------
# 📊 Status command
# -------------------------------
status_agents() {
  echo "📊 Running Agents:"
  jq '.agents' $PORT_FILE
}

# -------------------------------
# 📜 Logs viewer
# -------------------------------
view_logs() {
  if [ -z "$AGENT_NAME" ]; then
    echo "❌ Provide agent name"
    exit 1
  fi

  tail -f "$LOG_DIR/$AGENT_NAME.log"
}

# -------------------------------
# 🎯 Command handler
# -------------------------------
case $COMMAND in
  start)
    start_agent
    ;;
  stop)
    stop_agent
    ;;
  status)
    status_agents
    ;;
  logs)
    view_logs
    ;;
  *)
    echo "Usage:"
    echo "./agent-runner.sh start <agent> <feature>"
    echo "./agent-runner.sh stop <agent>"
    echo "./agent-runner.sh status"
    echo "./agent-runner.sh logs <agent>"
    ;;
esac