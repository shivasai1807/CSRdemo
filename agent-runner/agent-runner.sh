#!/bin/bash

COMMAND=$1
AGENT_NAME=$2
FEATURE_NAME=$3

PORT_FILE="port-registry.json"

get_next_port() {
  PORT=$(jq '.nextPort' $PORT_FILE)
  NEW_PORT=$((PORT + 1))
  jq ".nextPort = $NEW_PORT" $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE
  echo $PORT
}

start_agent() {
  echo "🚀 Starting agent: $AGENT_NAME for feature: $FEATURE_NAME"

  # Step 1: Create branch
  BRANCH="feature/$AGENT_NAME/$FEATURE_NAME"
  git checkout -b $BRANCH

  # Step 2: Assign port
  PORT=$(get_next_port)
  echo "Assigned Port: $PORT"

  # Step 3: Run app
  PORT=$PORT npm run dev > logs/$AGENT_NAME.log 2>&1 &

  PID=$!

  # Step 4: Save agent info
  jq ".agents += [{\"agent\":\"$AGENT_NAME\",\"feature\":\"$FEATURE_NAME\",\"port\":$PORT,\"pid\":$PID}]" \
    $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE

  echo "✅ Running at http://localhost:$PORT"
}

stop_agent() {
  echo "🛑 Stopping agent: $AGENT_NAME"

  PID=$(jq -r ".agents[] | select(.agent==\"$AGENT_NAME\") | .pid" $PORT_FILE)

  kill $PID

  jq "del(.agents[] | select(.agent==\"$AGENT_NAME\"))" \
    $PORT_FILE > tmp.json && mv tmp.json $PORT_FILE

  echo "✅ Agent stopped"
}

case $COMMAND in
  start)
    start_agent
    ;;
  stop)
    stop_agent
    ;;
  *)
    echo "Usage:"
    echo "./agent-runner.sh start <agent-name> <feature-name>"
    echo "./agent-runner.sh stop <agent-name>"
    ;;
esac