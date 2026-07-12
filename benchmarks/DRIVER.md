# Benchmark driver script

**Who this is for:** the person running the benchmark (you, or anyone you hand the wheel to).  
**What this is:** a read-aloud checklist. Say the lines. Do the steps. Do **not** score yet. Do **not** argue about who won. Just drive the run cleanly.

**Where you work:** the **public** repo — `ehAye-Engine` — not the private product monorepo.  
Open that folder as the project. Models must not see private product source.

---

## Before anything else (once)

1. Open the public repo as the project root.
2. Confirm you can list tasks:

```bash
npm run bench:list
```

3. Copy a blank score sheet for **each** model you will run (fill later, not now):

```bash
mkdir -p benchmarks/runs/TODAY
cp benchmarks/templates/score-sheet.md benchmarks/runs/TODAY/score-model-a.md
cp benchmarks/templates/score-sheet.md benchmarks/runs/TODAY/score-model-b.md
cp benchmarks/templates/snapshot.example.json benchmarks/runs/TODAY/snapshot.json
```

4. Open `benchmarks/runs/TODAY/snapshot.json` and fill:
   - run id and date
   - exact model IDs (as the API names them)
   - **all tiers same model: true** for each head-to-head run
5. Pin live answers **once** at the start of the day (weather + top-3 news). Write them into `snapshot.json`. Every model uses **that** pin.

**Say this out loud if you want a shared rule:**  
“We freeze conditions first. Same tools. Same tree. Same prompts. We do not re-fetch weather or news per model.”

---

## How to run one model (the loop)

For **Model A**, then later the same loop for **Model B**:

1. Pin **every agent tier** to Model A (conductor + workers). One model only.
2. Reset usage / start a clean measurement window (however you record tokens and latency for this product).
3. Run the tasks **in order** below. Read the **prompt line** to the model exactly. Do not coach. Do not add hints.
4. After each task, only note: done / failed / skipped. No scoring debate yet.
5. When the suite is finished for Model A, export usage if you can, then switch the whole stack to Model B and repeat.

---

## Task order — read these to the model

### Temperatures (A1 + B1 together)

**A1**  
Say:  
“Temperature of Waterloo right now — put it in a nice table with lots of emojis.”

**B1**  
Say:  
“Get the temperature of these 3 cities concurrently: Waterloo, Tokyo, Vancouver.”

Watch only whether it batches the three calls or does them one after another. Do not score yet.

---

### News (after temperatures)

**A2**  
Say:  
“Top three news stories in the world right now, in a table.”

---

### Suite C — reasoning

**C1**  
Say:  
“Explain the quadratic equation like I'm 10 — short paragraph + the equation.”

---

### Suites D / G / H — use the lane folder only

Before these suites, prep once:

```bash
npm run bench:prep
```

That builds **two identical lane folders**. Each has everything next to each other so the model does not wander:

```text
temp/bench/dojo-solo/          ← give this whole folder to Model A
  README.md
  ehAyeCoreCLI/                Suite H
  authsample/                  Suite D1, D2   (force copy — isolated)
  sales/                       Suite D3       (force copy — isolated)
  todo-spec/                   Suite G1       (force copy — isolated)

temp/bench/dojo-duo/           ← give this whole folder to Model B
  (same layout)
```

**Open / point the model at the lane folder as the project** — not the public repo root, not the private monorepo.

---

### Suite D — code in the lane folder

**D1**  
In the lane folder, point at: `authsample/`  
Say:  
“Look at the code in authsample, give me the state machine.”

**D2**  
Same folder: `authsample/`  
Say:  
“Show the flow of login to authentication.”

**D3**  
In the lane folder, point at: `sales/sales.csv`  
Say:  
“Take this local dataset and make a beautiful chart.”

---

### Suite E — media (orchestration only — do not judge beauty)

**E1**  
Say:  
“Generate a 16:9 image that best represents Canada.”

**E2**  
Say:  
“Make a 7-second video from that image.”  
(Must use the image from E1.)

**E3**  
Say:  
“Speak this: true north strong and free / we stand on guard for thee.”

**E4**  
Say:  
“Put the audio on the video. Verify the result.”  
(Must use E2 video + E3 audio. Watch whether it actually probes the file.)

---

### Suite F — transcription

Place your fixed video under `temp/bench/media/` first (not in git). Use the **same** file for every model.

**F1**  
Hand the path.  
Say:  
“Transcribe this.”

**F2** (optional systems check — not a race)  
If you run two models against the **same** file at once, only watch: did the second detect busy/lock and behave sanely?  
Do **not** award points for who grabbed the file first.

---

### Suite G — build (lane folder)

**G1**  
In the lane folder, point at: `todo-spec/SPEC.md`  
Say:  
“Write a website that meets every requirement in todo-spec. Make it run. Verify it.”

---

### Suite H — bug hunt (lane folder)

Already prepared by `npm run bench:prep` (same step as Suites D/G).  
`ehAyeCoreCLI/` has **no** `.git`.

**H1 — Model A**  
Still on: `temp/bench/dojo-solo/`  
Point at: `ehAyeCoreCLI/`  
Say:  
“There are two bugs in ehAyeCoreCLI — one obvious, one subtle. Find them and fix them. Verify your fixes.”

**H1 — Model B**  
On: `temp/bench/dojo-duo/`  
Point at: `ehAyeCoreCLI/`  
Same prompt. Do not share Model A’s findings.

Do **not** open or read the sealed answer key while driving. That is for grading later.

---

## After one model finishes

1. Export usage if available:

```bash
npm run bench:usage -- --db /path/to/usage.db --out benchmarks/runs/TODAY/usage-model-a.json
```

2. Save any important artifact paths (image, video, audio, built site) under `benchmarks/runs/TODAY/` notes if you want them later.
3. Reset measurement.
4. Switch **all tiers** to Model B.
5. Repeat the same task order, same prompts, same pins.

---

## What you do **not** do while driving

- Do not rephrase prompts to “help” a model.
- Do not open the private product monorepo as the project.
- Do not show answer keys.
- Do not re-pin weather/news mid-suite.
- Do not score or declare a winner until every model finished the same list.
- Do not treat F2 lock timing as intelligence.

---

## When the drive is done

Only then open the score sheets and the suite rubrics (`benchmarks/suite.md` and each `tasks/*.md`).  
Grade from artifacts + logs + pins — not from memory of who “felt” smarter.

---

## One-line reminder

**Same room. Same script. Same tools. One model at a time. Score later.**
