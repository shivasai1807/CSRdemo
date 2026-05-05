#!/bin/bash

COMMAND=$1
ARG1=$2
ARG2=$3

AGENT_NAME=$ARG1
FEATURE_NAME=$ARG2
AGENT_ID=$ARG1

PORT_FILE="port-registry.json"
LOG_DIR="logs"

mkdir -p $LOG_DIR

# -------------------------------
# 🔢 Generate short unique ID
# -------------------------------
generate_agent_id() {
  RAND=$(openssl rand -hex 3)   # 6-char random
  echo "${AGENT_NAME}-${RAND}"
}

# -------------------------------
# 🔢 Get next port
# -------------------------------
get_next_port() {
  PORT=$(jq '.nextPort' $PORT_FILE)
  NEW_PORT=$((PORT + 1))
  jq ".nextPort = $NEW_PORT" $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE
  echo $PORT
}

# -------------------------------
# ⚠️ Warn if agents running
# -------------------------------
check_running_agents() {
  COUNT=$(jq '.agents | length' $PORT_FILE)
  if [ "$COUNT" -gt 0 ]; then
    echo "⚠️ Agents already running. Avoid manual git checkout."
  fi
}

# -------------------------------
# 🧹 Ensure clean state
# -------------------------------
ensure_clean_state() {
  CURRENT_BRANCH=$(git branch --show-current)
  if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Switching to main..."
    git checkout main
  fi
}

# -------------------------------
# 🌿 Branch handling
# -------------------------------
create_or_switch_branch() {
  BRANCH="feature/$AGENT_NAME/$FEATURE_NAME"

  if git show-ref --verify --quiet refs/heads/$BRANCH; then
    echo "🔁 Switching to existing branch"
    git checkout $BRANCH

  elif git ls-remote --heads origin $BRANCH | grep $BRANCH > /dev/null; then
    echo "🌐 Fetching remote branch"
    git fetch origin $BRANCH
    git checkout -b $BRANCH origin/$BRANCH

  else
    echo "🌱 Creating new branch"
    git checkout -b $BRANCH
  fi
}

# -------------------------------
# 🚀 Start agent
# -------------------------------
start_agent() {
  if [ -z "$AGENT_NAME" ] || [ -z "$FEATURE_NAME" ]; then
    echo "❌ Usage: ./agent-runner.sh start <agent> <feature>"
    exit 1
  fi

  NEW_ID=$(generate_agent_id)

  echo "🚀 Starting: $NEW_ID"

  check_running_agents
  ensure_clean_state
  create_or_switch_branch

  PORT=$(get_next_port)

  PORT=$PORT npm run dev > "$LOG_DIR/$NEW_ID.log" 2>&1 &
  PID=$!

  jq ".agents += [{
    \"id\":\"$NEW_ID\",
    \"agent\":\"$AGENT_NAME\",
    \"feature\":\"$FEATURE_NAME\",
    \"port\":$PORT,
    \"pid\":$PID
  }]" $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE

  echo "✅ Started"
  echo "ID   : $NEW_ID"
  echo "URL  : http://localhost:$PORT"
}

# -------------------------------
# 🛑 Stop single agent (by ID)
# -------------------------------
stop_agent() {
  if [ -z "$AGENT_ID" ]; then
    echo "❌ Usage: ./agent-runner.sh stop <agent-id>"
    exit 1
  fi

  PID=$(jq -r ".agents[] | select(.id==\"$AGENT_ID\") | .pid" $PORT_FILE)

  if [ "$PID" == "null" ] || [ -z "$PID" ]; then
    echo "❌ Agent not found"
    exit 1
  fi

  kill $PID

  jq "del(.agents[] | select(.id==\"$AGENT_ID\"))" \
    $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE

  echo "🛑 Stopped: $AGENT_ID"
}

# -------------------------------
# 🛑 Stop ALL agents
# -------------------------------
stop_all_agents() {
  COUNT=$(jq '.agents | length' $PORT_FILE)

  if [ "$COUNT" -eq 0 ]; then
    echo "ℹ️ No running agents"
    exit 0
  fi

  echo "🛑 Stopping ALL agents..."

  jq -c '.agents[]' $PORT_FILE | while read agent; do
    PID=$(echo $agent | jq '.pid')
    ID=$(echo $agent | jq -r '.id')

    kill $PID 2>/dev/null
    echo "✔ Stopped $ID"
  done

  jq '.agents = []' $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE

  echo "✅ All agents stopped"
}

# -------------------------------
# 📊 Status
# -------------------------------
status_agents() {
  echo "📊 Running Agents:"
  jq '.agents[] | {id, agent, feature, port}' $PORT_FILE
}

# -------------------------------
# 📜 Logs
# -------------------------------
view_logs() {
  if [ -z "$AGENT_ID" ]; then
    echo "❌ Usage: ./agent-runner.sh logs <agent-id>"
    exit 1
  fi

  tail -f "$LOG_DIR/$AGENT_ID.log"
}

# -------------------------------
# 🎯 Commands
# -------------------------------
case $COMMAND in
  start)
    start_agent
    ;;
  stop)
    stop_agent
    ;;
  stop-all)
    stop_all_agents
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
    echo "./agent-runner.sh stop <agent-id>"
    echo "./agent-runner.sh stop-all"
    echo "./agent-runner.sh status"
    echo "./agent-runner.sh logs <agent-id>"
    ;;
esac