# Agent Runner – Development Journey & System Flow

## 📌 Overview

Agent Runner is a lightweight multi-agent orchestration tool built using Bash scripting to support parallel feature development workflows.

The primary goal of this system is to:

* Prevent port conflicts
* Isolate feature development
* Automate Git branch handling
* Track running development agents
* Improve developer workflow efficiency

This document tracks:

* System architecture
* Feature evolution
* Problem-solving process
* Design decisions
* Workflow implementation
* Thinking process during development

---

# 🚀 Initial Problem Statement

While developing the CSR website, multiple features needed to be implemented simultaneously.

Problems identified:

* Running multiple instances caused port conflicts
* Manual branch creation was repetitive
* Developers could accidentally work on the wrong branch
* No centralized tracking of running agents
* Stopping one agent could accidentally stop another
* Logs were difficult to track

The goal became:

> Create a lightweight orchestration system that automatically manages branches, ports, processes, and agent lifecycle.

---

# 🧠 Development Thought Process

The system evolved incrementally through solving real workflow problems.

Instead of directly building a complex orchestration platform, the development followed:

1. Build minimal working version
2. Identify workflow problems
3. Improve isolation and tracking
4. Add safety mechanisms
5. Improve developer experience

---

# 🏗️ System Architecture

## Core Components

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
│   ├── agent1.log
│   └── agent2.log
│
├── src/
├── public/
└── package.json
```

---

# ⚙️ Evolution of the System

---

# ✅ Phase 1 – Basic Agent Runner

## Features Added

* Start agent
* Stop agent
* Port allocation
* Branch creation
* Process tracking

## Problem Solved

Allowed parallel development environments.

## Initial Workflow

```bash
./agent-runner.sh start agent1 csr-map
```

Result:

* Created branch
* Assigned port
* Started application

---

# ✅ Phase 2 – Smart Branch Handling

## Problem Identified

The system created duplicate branches or failed when branches already existed.

## Improvement Added

Implemented:

* Branch existence check
* Remote branch fetch support
* Automatic branch switching

## Logic Added

```text
IF branch exists locally
    switch branch
ELSE IF branch exists remotely
    fetch + switch
ELSE
    create branch
```

## Benefit

The system became reusable and safer.

---

# ✅ Phase 3 – Agent ↔ Branch Synchronization

## Problem Identified

Developers could manually switch branches while agents were running.

This caused:

* Wrong feature context
* Branch-agent mismatch
* Confusing development state

## Improvement Added

Implemented:

* Auto switch to main before agent creation
* Automatic branch synchronization
* Warning when agents already running

## Result

Each agent became tightly linked to its branch.

---

# ✅ Phase 4 – Unique Agent IDs

## Problem Identified

Multiple agents with the same name caused issues.

Example:

```bash
./agent-runner.sh start agent1 map
./agent-runner.sh start agent1 gallery
```

Stopping one agent stopped all agents with the same name.

## Root Cause

Agent tracking used only:

```json
{
  "agent": "agent1"
}
```

## Improvement Added

Implemented:

* Unique agent IDs
* Individual process tracking
* Individual log files

## New ID Format

```text
agent1-a3f1
agent1-b82d
```

## Benefit

Each running instance became fully isolated.

---

# ✅ Phase 5 – Stop-All Support

## Problem Identified

Stopping agents one-by-one became inefficient.

## Improvement Added

Implemented:

```bash
./agent-runner.sh stop-all
```

## Behavior

* Stops all running processes
* Clears registry
* Returns system to clean state

---

# ✅ Phase 6 – Registry Improvements

## Problem Identified

The registry only tracked ports and process IDs.

This was insufficient for debugging and orchestration.

## Improvement Added

Stored additional metadata:

* Repo name
* Repo path
* Branch name
* Feature name
* Agent ID
* Process ID
* Port

## Final Registry Example

```json
{
  "id": "agent1-a3f1",
  "agent": "agent1-a3f1",
  "feature": "csr-gallery",
  "branch": "agent1-a3f1",
  "repo": "CSRdemo-main",
  "path": "/Users/shiva/CSRdemo-main",
  "port": 3001,
  "pid": 14221
}
```

## Benefit

The system became traceable and debuggable.

---

# ✅ Phase 7 – Automatic Main Branch Recovery

## Problem Identified

After stopping agents, the developer remained on the feature branch.

This created confusion for future agent runs.

## Improvement Added

Implemented:

```text
On agent stop:
    switch back to main branch
```

## Benefit

The repository always returns to a clean state.

---

# 🔥 Final Features Implemented

## Core Features

### ✅ Multi-Agent Support

Run multiple development environments simultaneously.

---

### ✅ Automatic Branch Management

* Create branch
* Switch branch
* Fetch remote branch
* Sync agent with branch

---

### ✅ Dynamic Port Allocation

Each agent receives a unique port.

Example:

```text
agent1 → 3001
agent2 → 3002
agent3 → 3003
```

---

### ✅ Process Tracking

Each running process stores:

* PID
* Port
* Branch
* Logs

---

### ✅ Logging System

Each agent generates:

```text
logs/<agent-id>.log
```

---

### ✅ Status Command

```bash
./agent-runner.sh status
```

Displays:

* Running agents
* Branches
* Ports
* Features

---

### ✅ Stop Individual Agent

```bash
./agent-runner.sh stop <agent-id>
```

---

### ✅ Stop All Agents

```bash
./agent-runner.sh stop-all
```

---

# 🔄 Final Workflow

## Step 1 – Start Agent

```bash
./agent-runner.sh start csr-map-agent map-feature
```

System Actions:

* Switch to main
* Create/switch branch
* Allocate port
* Start application
* Track process
* Save metadata

---

## Step 2 – Implement Feature

Example:

* CSR Map
* Testimonials
* Gallery
* FAQ

---

## Step 3 – Test Feature

Example:

```text
http://localhost:3001
```

---

## Step 4 – Stop Agent

```bash
./agent-runner.sh stop csr-map-agent
```

System Actions:

* Kill process
* Remove registry entry
* Switch back to main

---

# 🧪 CSR Website Features Implemented Using Agent Runner

## Features Selected

### 1. CSR Activities Map

Purpose:

* Show geographical impact of CSR activities
* Interactive map visualization

---

### 2. Beneficiary Stories / Testimonials

Purpose:

* Showcase human impact
* Improve authenticity and trust

---

### 3. CSR Gallery

Purpose:

* Visual proof of CSR activities
* Improve engagement

---

### 4. FAQ Section

Purpose:

* Improve usability
* Clarify CSR concepts

---

# 🧠 Key Engineering Learnings

## 1. Start Small

Instead of building a large orchestration system initially, a minimal working system was developed first.

---

## 2. Solve Real Problems Incrementally

Each improvement came from identifying workflow issues.

---

## 3. Isolation is Important

Proper:

* branch isolation
* process isolation
* port isolation

are critical for multi-agent systems.

---

## 4. Metadata Tracking Matters

Tracking:

* repo
* branch
* pid
* path
* logs

made debugging significantly easier.

---

## 5. Automation Improves Productivity

Automating repetitive tasks reduced:

* manual setup
* branch confusion
* port conflicts

---

# 🚀 Future Improvements

## Planned Upgrades

* Docker container isolation
* Git worktree support
* Web dashboard UI
* Auto PR creation
* Restart command
* Port recycling
* Slack integration
* Real-time monitoring

---

# 📌 Final Outcome

The final Agent Runner system successfully provides:

* Multi-agent orchestration
* Parallel feature development
* Automatic Git branch handling
* Dynamic port management
* Logs and process tracking
* Clean workflow management

The system evolved through iterative problem-solving and workflow optimization rather than pre-designed architecture.

This project demonstrates:

* systems thinking
* workflow automation
* debugging ability
* incremental engineering
* developer tooling design

---

# ✅ Final Commands Reference

## Start Agent

```bash
./agent-runner.sh start <agent-name> <feature>
```

---

## Start Auto-Generated Agent

```bash
./agent-runner.sh start
```

---

## Stop Agent

```bash
./agent-runner.sh stop <agent-id>
```

---

## Stop All Agents

```bash
./agent-runner.sh stop-all
```

---

## View Running Agents

```bash
./agent-runner.sh status
```

---

## View Logs

```bash
./agent-runner.sh logs <agent-id>
```
