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

### Suite D — code in this repo

Point the model at the fixture folders (or leave the project open so those paths are visible).

**D1**  
Point at: `benchmarks/fixtures/authsample/`  
Say:  
“Look at the code in the auth sample fixture, give me the state machine.”

**D2**  
Same folder.  
Say:  
“Show the flow of login to authentication.”

**D3**  
Point at: `benchmarks/fixtures/sales/sales.csv`  
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

### Suite G — build

**G1**  
Point at: `benchmarks/fixtures/todo-spec/SPEC.md`  
Say:  
“Write a website that meets every requirement in the todo-spec fixture. Make it run. Verify it.”

---

### Suite H — bug hunt

Prep **once** before either model starts H:

```bash
npm run bench:prep
```

That creates:

- `temp/bench/dojo-solo/ehAyeCoreCLI/`
- `temp/bench/dojo-duo/ehAyeCoreCLI/`

Both are identical. Both have **no** `.git`.

**H1 — Model A**  
Point Model A only at: `temp/bench/dojo-solo/ehAyeCoreCLI`  
Say:  
“There are two bugs in this project — one obvious, one subtle. Find them and fix them. Verify your fixes.”

**H1 — Model B**  
Point Model B only at: `temp/bench/dojo-duo/ehAyeCoreCLI`  
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
