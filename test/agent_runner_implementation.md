# 🚀 Agent Runner – Implementation Guide

This guide helps you set up and run the Agent Runner CLI tool for parallel multi-agent development with isolated environments.

---

# 📦 1. Prerequisites

Make sure the following are installed:

- Git  
- Docker  
- Bash (Linux / Mac / WSL for Windows)  

---

# 📁 2. Project Setup

## Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd agent-runner
```

---

## Step 2: Create Required Files

### port-registry.json
```json
{
  "next_port": 3001
}
```

### Dockerfile
```Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

### scripts/start-agent.sh
```bash
#!/bin/bash

AGENT_NAME=$1
FEATURE_NAME=$2

if [ -z "$AGENT_NAME" ] || [ -z "$FEATURE_NAME" ]; then
  echo "Usage: ./start-agent.sh <agent-name> <feature-name>"
  exit 1
fi

BRANCH_NAME="feature/$AGENT_NAME/$FEATURE_NAME"

echo "🚀 Starting $BRANCH_NAME"

git checkout main
git pull origin main
git checkout -b $BRANCH_NAME

PORT=$(jq '.next_port' port-registry.json)
NEW_PORT=$((PORT + 1))
jq ".next_port=$NEW_PORT" port-registry.json > temp.json && mv temp.json port-registry.json

ENV_FILE=".env.$AGENT_NAME"
echo "PORT=$PORT" > $ENV_FILE

CONTAINER_NAME="${AGENT_NAME}_${FEATURE_NAME}"

docker run -d   -p $PORT:3000   --name $CONTAINER_NAME   --env-file $ENV_FILE   $(docker build -q .)

echo "🌐 Running at http://localhost:$PORT"

git add .
git commit -m "Setup $BRANCH_NAME with port $PORT"
git push origin $BRANCH_NAME
```

---

## Step 3: Make Script Executable

```bash
chmod +x scripts/start-agent.sh
```

---

# ⚙️ 3. Setup CLI Command

```bash
sudo ln -s $(pwd)/scripts/start-agent.sh /usr/local/bin/agent-runner
```

---

# 🚀 4. Usage

## Start an Agent
```bash
agent-runner agent-A login-feature
```

---

# 🔁 5. Run Multiple Agents

```bash
agent-runner agent-A login
agent-runner agent-B dashboard
agent-runner agent-C payments
```

---

# 🛑 6. Stop Agent

```bash
docker stop <container_name>
docker rm <container_name>
```

---

# 🧹 7. Cleanup

```bash
docker container prune
```

---

# 🌿 8. Git Workflow

feature/<agent>/<feature>

---

# ⚠️ 9. Rules

- Do NOT use same port manually  
- Do NOT commit to main  
- Use separate branches  

---

# 🎯 10. Summary

Agent Runner enables parallel development with no conflicts.
