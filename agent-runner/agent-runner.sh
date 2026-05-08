#!/bin/bash

COMMAND=$1
ARG1=$2
ARG2=$3

PORT_FILE="port-registry.json"
LOG_DIR="logs"

mkdir -p $LOG_DIR

# -----------------------------------
# 📦 Repo Info
# -----------------------------------
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
REPO_PATH=$(git rev-parse --show-toplevel)

# -----------------------------------
# 🔥 Generate concise ID
# -----------------------------------
generate_short_id() {
  echo "$(date +%M%S)-$(openssl rand -hex 2)"
}

# -----------------------------------
# 🤖 Generate Agent Name
# -----------------------------------
generate_agent_name() {
  echo "agent1-$(generate_short_id)"
}

# -----------------------------------
# 🔢 Get next port
# -----------------------------------
get_next_port() {

  PORT=$(jq '.nextPort' $PORT_FILE)

  NEW_PORT=$((PORT + 1))

  jq ".nextPort = $NEW_PORT" $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE

  echo $PORT
}

# -----------------------------------
# ⚠️ Running Agent Warning
# -----------------------------------
check_running_agents() {

  COUNT=$(jq '.agents | length' $PORT_FILE)

  if [ "$COUNT" -gt 0 ]; then
    echo "⚠️ Agents already running"
    echo "👉 Avoid manual git branch switching"
  fi
}

# -----------------------------------
# 🧹 Ensure Main Branch
# -----------------------------------
ensure_clean_state() {

  CURRENT_BRANCH=$(git branch --show-current)

  if [ "$CURRENT_BRANCH" != "main" ]; then

    echo "🔄 Switching to main branch..."

    git checkout main
  fi
}

# -----------------------------------
# 🌿 Create or Switch Branch
# Branch Name = Agent ID
# -----------------------------------
create_or_switch_branch() {

  BRANCH=$AGENT_ID

  if git show-ref --verify --quiet refs/heads/$BRANCH; then

    echo "🔁 Switching to existing branch: $BRANCH"

    git checkout $BRANCH

  elif git ls-remote --heads origin $BRANCH | grep $BRANCH > /dev/null; then

    echo "🌐 Fetching remote branch: $BRANCH"

    git fetch origin $BRANCH

    git checkout -b $BRANCH origin/$BRANCH

  else

    echo "🌱 Creating new branch: $BRANCH"

    git checkout -b $BRANCH
  fi
}

# -----------------------------------
# 🚀 Start Agent
# -----------------------------------
start_agent() {

  FEATURE_NAME=$ARG2

  # Auto-generate agent name if not provided
  if [ -z "$ARG1" ]; then

    AGENT_NAME=$(generate_agent_name)

  else

    AGENT_NAME=$ARG1

  fi

  AGENT_ID=$AGENT_NAME

  echo ""
  echo "🚀 Starting Agent: $AGENT_ID"

  check_running_agents

  ensure_clean_state

  create_or_switch_branch

  PORT=$(get_next_port)

  echo "🔌 Assigned Port: $PORT"

  PORT=$PORT npm run dev > "$LOG_DIR/$AGENT_ID.log" 2>&1 &

  PID=$!

  jq ".agents += [{
    \"id\":\"$AGENT_ID\",
    \"agent\":\"$AGENT_NAME\",
    \"feature\":\"$FEATURE_NAME\",
    \"branch\":\"$AGENT_ID\",
    \"repo\":\"$REPO_NAME\",
    \"path\":\"$REPO_PATH\",
    \"port\":$PORT,
    \"pid\":$PID
  }]" $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE

  echo ""
  echo "✅ Agent Started Successfully"
  echo "----------------------------------"
  echo "🆔 Agent ID : $AGENT_ID"
  echo "🌿 Branch   : $AGENT_ID"
  echo "🔌 Port     : $PORT"
  echo "🌐 URL      : http://localhost:$PORT"
  echo "📄 Logs     : logs/$AGENT_ID.log"
  echo "----------------------------------"
}

# -----------------------------------
# 🛑 Stop Agent
# Also switch back to main
# -----------------------------------
stop_agent() {

  AGENT_ID=$ARG1

  if [ -z "$AGENT_ID" ]; then

    echo "❌ Usage:"
    echo "./agent-runner.sh stop <agent-id>"
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

  echo "🛑 Agent stopped: $AGENT_ID"

  # Switch back to main branch
  CURRENT_BRANCH=$(git branch --show-current)

  if [ "$CURRENT_BRANCH" == "$AGENT_ID" ]; then

    echo "🔄 Switching back to main branch..."

    git checkout main
  fi
}

# -----------------------------------
# 🛑 Stop ALL Agents
# Also switch back to main
# -----------------------------------
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

  # Switch back to main branch
  CURRENT_BRANCH=$(git branch --show-current)

  if [ "$CURRENT_BRANCH" != "main" ]; then

    echo "🔄 Switching back to main branch..."

    git checkout main
  fi
}

# -----------------------------------
# 📊 Status
# -----------------------------------
status_agents() {

  echo ""
  echo "📊 Running Agents"
  echo "----------------------------------"

  jq '.agents[] | {
    id,
    branch,
    feature,
    repo,
    path,
    port
  }' $PORT_FILE

  echo "----------------------------------"
}

# -----------------------------------
# 📜 View Logs
# -----------------------------------
view_logs() {

  AGENT_ID=$ARG1

  if [ -z "$AGENT_ID" ]; then

    echo "❌ Usage:"
    echo "./agent-runner.sh logs <agent-id>"
    exit 1
  fi

  tail -f "$LOG_DIR/$AGENT_ID.log"
}

# -----------------------------------
# 🎯 Command Handler
# -----------------------------------
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
    echo ""
    echo "Usage:"
    echo "----------------------------------"
    echo "./agent-runner.sh start <agent-name> <feature>"
    echo "./agent-runner.sh start"
    echo "./agent-runner.sh stop <agent-id>"
    echo "./agent-runner.sh stop-all"
    echo "./agent-runner.sh status"
    echo "./agent-runner.sh logs <agent-id>"
    echo "----------------------------------"
    ;;

esac