# Bullet Termux AI OS (mini)

A tiny **offline-first AI OS-style shell for Termux**. It stays small: one POSIX `sh` script, no heavy framework, and no internet is required for built-in offline recipes.

## What it does

- `bullet offline "..."` gives local Termux help from built-in recipes, no network/model/key.
- `bullet chat` starts an interactive **AI chat bot** with local history.
- `bullet chat "TEXT"` sends one bot message.
- `bullet agi "GOAL"` runs **AGI mode**: a tiny offline Autonomous Goal Interface that plans, stores memory, and tracks goals.
- `bullet fix big` or `bullet bigfix` runs a safe big-fix checklist plus self-test.
- `bullet test` runs the built-in offline self-test.
- `bullet ask "..."` uses offline recipes by default until you configure an API.
- `BULLET_OFFLINE=1 bullet ask "..."` forces offline mode even if API config exists.
- `bullet` opens a mini command shell for prompts and phone/Linux helpers.
- `bullet note "..."` saves quick notes in `~/.bullet/notes.md`.
- `bullet run "..."` runs a shell command.
- `bullet sys` shows device/Linux/storage info.
- Optional online mode supports OpenAI-compatible chat APIs or a local OpenAI-compatible LLM server.

> In Bullet, **AGI** means **Autonomous Goal Interface**. It is an offline planner/memory loop, not real artificial general intelligence.

## Install on Termux

```sh
pkg update
pkg install git

git clone -b arena/01a0f681-fix https://github.com/luffy45k/Fix-.git
cd Fix-
sh install-termux.sh
bullet test
bullet doctor
```

Or run without installing:

```sh
chmod +x ./bullet
./bullet test
./bullet doctor
```

## One-command install + big fix

```sh
pkg update -y && pkg install git -y && { [ -d Fix- ] || git clone -b arena/01a0f681-fix https://github.com/luffy45k/Fix-.git; } && cd Fix- && git fetch origin arena/01a0f681-fix && git checkout arena/01a0f681-fix && git pull --ff-only origin arena/01a0f681-fix && sh install-termux.sh && hash -r && bullet fix big
```

## Run offline

```sh
bullet offline "help"
bullet offline "storage clean"
bullet offline "backup home"
bullet offline "find large files"
BULLET_OFFLINE=1 bullet ask "python setup"
```

Offline recipes include storage cleanup, backups, file search, storage permissions, Python, Git, packages, processes, network checks, and Termux:API hints.

## AI chat bot

Start the bot:

```sh
bullet chat
```

Send one message:

```sh
bullet chat "hello"
bullet chat "storage clean"
bullet chat "backup home"
```

Manage history:

```sh
bullet chat history
bullet chat clear
```

Inside chat:

```text
/help
/history
/clear
/sys
/agi make my Termux faster
/note remember this
/offline storage clean
/exit
```

Chat history is stored in:

```text
~/.bullet/chat-history.md
```

## AGI mode

AGI mode turns a goal into an observe/plan/act/review checklist and saves it locally.

```sh
bullet agi "make my Termux faster"
bullet agi "backup my home folder"
bullet agi "prepare a Python coding setup"
bullet agi remember "I prefer offline commands only"
bullet agi tasks
bullet agi memory
```

AGI files are stored in:

```text
~/.bullet/agi-memory.md
~/.bullet/agi-tasks.md
```

## Fix mode

```sh
bullet fix big
bullet bigfix
bullet fix path
bullet fix install
bullet fix storage
bullet fix permission
bullet fix git
bullet test
```

Fix mode prints safe commands first and does not delete personal files.

## Configure optional online/local AI

OpenAI-compatible cloud API:

```sh
bullet config YOUR_API_KEY gpt-4o-mini https://api.openai.com/v1
bullet ask "Give me 5 Termux storage saving tips"
```

Local/Ollama-style API example:

```sh
BULLET_API_BASE=http://127.0.0.1:11434/v1 \
BULLET_MODEL=tinyllama \
bullet ask "Create a tiny backup command for Termux"
```

## Mini shell

```sh
bullet
```

Commands inside the shell:

```text
/ask TEXT           ask AI; offline fallback if no API is configured
/chat TEXT          send one chat-bot message
/offline TEXT       force local offline recipe
/agi TEXT           AGI goal planner
/agi remember TEXT  save AGI memory
/agi tasks          show saved AGI goals
/agi memory         show AGI memory
/fix TEXT           safe fix/checklist mode
/bigfix            run big-fix checklist
/test               run self-test
/note TEXT          save a note
/notes              show notes
/run COMMAND        run shell command
/sys                show system info
/help               show help
/exit               quit
```

## Keep it mini

- Main script: `bullet`
- Installer: `install-termux.sh`
- Runtime data: `~/.bullet/`
- No required runtime dependency for offline recipes, AI chat bot, AGI mode, fix mode, or self-test.
- Optional extras: `curl` for online AI, `jq` for better online JSON parsing.
