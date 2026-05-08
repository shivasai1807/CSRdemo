# Agent Runner - User Guide

## 🚀 Overview

Agent Runner is a lightweight Bash-based orchestration tool designed to help developers run multiple isolated development environments simultaneously without port conflicts or Git branch confusion.

The tool automatically:
- Creates or switches Git branches
- Assigns unique ports
- Starts development servers
- Tracks running agents
- Maintains logs
- Handles process management

---

# 📦 Prerequisites

Before using Agent Runner, ensure the following are installed:

## 1. Git
```bash
git --version
```

## 2. Node.js & npm
```bash
node -v
npm -v
```

## 3. jq

### Ubuntu/Linux
```bash
sudo apt install jq
```

### MacOS
```bash
brew install jq
```

### Windows
```bash
choco install jq
```

---

# 📂 Project Setup

Required structure:

```text
project-root/
│
├── agent-runner.sh
├── port-registry.json
├── logs/
├── package.json
└── src/
```

---

# 📄 Create port-registry.json

Create:

```text
port-registry.json
```

Add:

```json
{
  "nextPort": 3001,
  "agents": []
}
```

---

# 🔐 Make Script Executable

```bash
chmod +x agent-runner.sh
```

---

# ▶️ Start an Agent

## Command

```bash
./agent-runner.sh start <agent-name> <feature-name>
```

## Example

```bash
./agent-runner.sh start map-agent csr-map
```

---

# ⚡ Internal Workflow

When an agent starts:

1. Switches to main branch
2. Creates/switches feature branch
3. Assigns unique port
4. Starts development server
5. Creates logs
6. Tracks metadata

---

# 🌿 Branch Naming

Branch name becomes:

```text
<agent-name>
```

Example:

```text
map-agent
```

---

# 🤖 Auto Generated Agent

```bash
./agent-runner.sh start
```

Generated Example:

```text
agent1-3522-a3f1
```

---

# 🌐 Open Running App

```text
http://localhost:<assigned-port>
```

Example:

```text
http://localhost:3001
```

---

# 📊 Check Running Agents

```bash
./agent-runner.sh status
```

Shows:
- Agent ID
- Branch
- Feature
- Port
- Repo info

---

# 📜 View Logs

```bash
./agent-runner.sh logs <agent-id>
```

Example:

```bash
./agent-runner.sh logs map-agent
```

---

# 🛑 Stop Single Agent

```bash
./agent-runner.sh stop <agent-id>
```

Example:

```bash
./agent-runner.sh stop map-agent
```

Behavior:
- Stops process
- Removes registry entry
- Switches back to main branch

---

# 🛑 Stop All Agents

```bash
./agent-runner.sh stop-all
```

Behavior:
- Stops all running agents
- Clears registry
- Switches back to main branch

---

# 📁 Logs Directory

Logs are stored in:

```text
logs/
```

Example:

```text
logs/map-agent.log
```

---

# 📄 Registry Tracking

Tracked data:
- Agent ID
- Branch
- Feature
- Repo
- Repo path
- Port
- PID

Example:

```json
{
  "id": "map-agent",
  "branch": "map-agent",
  "feature": "csr-map",
  "repo": "project-name",
  "path": "/Users/project-name",
  "port": 3001,
  "pid": 14221
}
```

---

# 🔄 Recommended Workflow

## Step 1
Start Agent

```bash
./agent-runner.sh start gallery-agent gallery-feature
```

## Step 2
Open localhost URL

```text
http://localhost:3001
```

## Step 3
Implement feature

## Step 4
View logs if needed

```bash
./agent-runner.sh logs gallery-agent
```

## Step 5
Stop agent

```bash
./agent-runner.sh stop gallery-agent
```

---

# ⚠️ Important Notes

## Avoid Manual Branch Switching

Avoid:

```bash
git checkout <branch>
```

while agents are running.

---

# 🧠 Best Practices

## Use Meaningful Agent Names

Good:
```text
gallery-agent
faq-agent
map-agent
```

Bad:
```text
abc
test1
```

---

## Stop Unused Agents

```bash
./agent-runner.sh stop-all
```

---

## Commit Per Feature

```bash
git add .
git commit -m "Added new feature"
```

---

# 🚀 Future Improvements

- Docker isolation
- Git worktree support
- Dashboard UI
- Restart command
- Auto PR creation
- Real-time monitoring

---

# ✅ Command Reference

## Start Agent
```bash
./agent-runner.sh start <agent-name> <feature-name>
```

## Start Auto Agent
```bash
./agent-runner.sh start
```

## Stop Agent
```bash
./agent-runner.sh stop <agent-id>
```

## Stop All Agents
```bash
./agent-runner.sh stop-all
```

## View Status
```bash
./agent-runner.sh status
```

## View Logs
```bash
./agent-runner.sh logs <agent-id>
```

---

# 📌 Final Summary

Agent Runner provides:
- Multi-agent orchestration
- Automatic branch management
- Dynamic port allocation
- Process tracking
- Logging support
- Simplified developer workflow
