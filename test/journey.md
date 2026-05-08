# Agent Runner – Engineering Journey

## 📌 Overview

Agent Runner is a lightweight multi-agent orchestration system built using Bash scripting to support parallel feature development workflows.

The system was designed to:
- Eliminate port conflicts
- Automate Git branch handling
- Isolate development workflows
- Track running agents
- Simplify feature development
- Improve developer productivity

---

# 🚀 Initial Problem

During development workflows, multiple features needed to be worked on simultaneously.

Problems identified:
- Multiple local instances caused port conflicts
- Manual branch management was repetitive
- Developers could accidentally work on wrong branches
- No centralized visibility into running environments
- Stopping one environment could affect others
- Logs and process tracking were difficult

Goal:
> Build a lightweight orchestration layer that automates environment setup, Git handling, and process isolation.

---

# 🧠 Development Philosophy

The system evolved incrementally:

1. Build minimal working version
2. Identify workflow issues
3. Improve automation and isolation
4. Add safety mechanisms
5. Improve developer experience

---

# 🏗️ Core Architecture

```text
agent-runner.sh
│
├── Git Branch Manager
├── Port Allocation System
├── Process Manager
├── Logs Manager
├── Agent Registry
└── CLI Command Handler
```

---

# 📂 Project Structure

```text
project-root/
│
├── agent-runner.sh
├── port-registry.json
├── logs/
├── src/
├── public/
└── package.json
```

---

# ⚙️ System Evolution

## ✅ Phase 1 – Basic Agent Runner

Features Added:
- Start agent
- Stop agent
- Port allocation
- Branch creation
- Process tracking

---

## ✅ Phase 2 – Smart Branch Management

Improvements:
- Local branch detection
- Remote branch detection
- Automatic branch switching
- Remote branch fetch support

---

## ✅ Phase 3 – Agent ↔ Branch Synchronization

Improvements:
- Automatic switch to main before agent creation
- Automatic branch synchronization
- Running agent warnings

---

## ✅ Phase 4 – Unique Agent IDs

Improvements:
- Unique agent IDs
- Independent process tracking
- Independent log files

Example:
```text
agent1-a3f1
agent1-b82d
```

---

## ✅ Phase 5 – Stop-All Support

Command:
```bash
./agent-runner.sh stop-all
```

Behavior:
- Stops all running processes
- Clears registry
- Returns system to clean state

---

## ✅ Phase 6 – Registry Enhancements

Registry tracks:
- Repo name
- Repo path
- Branch name
- Feature name
- Agent ID
- Process ID
- Port

---

## ✅ Phase 7 – Automatic Main Branch Recovery

Behavior:
```text
On agent stop:
    switch back to main branch
```

---

# 🔥 Final Features Implemented

- Multi-agent support
- Automatic Git branch handling
- Dynamic port allocation
- Process tracking
- Logging system
- Status command
- Stop individual agent
- Stop all agents

---

# 🔄 Final Workflow

## Start Agent

```bash
./agent-runner.sh start <agent-name> <feature>
```

System Actions:
- Switch to main branch
- Create/switch feature branch
- Allocate unique port
- Start application
- Track process
- Save metadata

---

## Stop Agent

```bash
./agent-runner.sh stop <agent-id>
```

System Actions:
- Kill process
- Remove registry entry
- Switch back to main branch

---

# 🧠 Key Engineering Learnings

- Start small and iterate
- Solve real workflow problems incrementally
- Isolation matters
- Metadata tracking improves debugging
- Automation improves productivity

---

# 🚀 Future Improvements

- Docker container isolation
- Git worktree support
- Dashboard UI
- Restart command
- Auto PR creation
- Port recycling
- Real-time monitoring
- Slack integration

---

# 📌 Final Outcome

The final Agent Runner system successfully provides:
- Multi-agent orchestration
- Parallel feature development
- Automatic Git branch management
- Dynamic port allocation
- Logs and process tracking
- Safe workflow handling

This project demonstrates:
- systems thinking
- workflow automation
- debugging ability
- incremental engineering
- developer tooling design

---

# ✅ Final Commands Reference

## Start Agent
```bash
./agent-runner.sh start <agent-name> <feature>
```

## Start Auto-Generated Agent
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

## View Running Agents
```bash
./agent-runner.sh status
```

## View Logs
```bash
./agent-runner.sh logs <agent-id>
```
