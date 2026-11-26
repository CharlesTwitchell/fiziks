# Fiziks

Unlimited physics practice problems. Every problem is a template that generates fresh numbers each time,
so students can drill the same idea until it clicks. Each problem has instant answer checking, step-by-step
hints and a fully worked solution.

It is a static site with no build step. Open `index.html` in a browser, or host it anywhere (GitHub Pages works as-is).

## Features

- **9 topics, 72 problem types**: kinematics, projectiles, Newton's laws, work & energy, momentum,
  circular motion & gravity, electricity, waves/oscillations/optics, and heat & thermodynamics.
- **Three difficulty levels**: Intro, Standard and Challenge.
- **Answer checking** within 2% tolerance. Accepts `12.5`, `3.2e-5`, `3.2x10^-5`, `1,250`.
- **Smart feedback**: flags sign errors, powers-of-ten (unit conversion) mistakes and factor-of-2 slips.
- **Shareable problems**: each problem's URL includes a seed, so a link reproduces the exact same numbers.
- **Progress tracking**: first-try accuracy per topic is saved in the browser (localStorage).
- **Physics history quiz**: 90 multiple-choice questions on famous discoveries and scientists, in 6 eras,
  played in 10-question rounds with explanations, a review of missed questions, and best scores.
- Math rendered with [KaTeX](https://katex.org). Works on phones, and supports light and dark mode.

## Structure

```
index.html              Topic overview
practice.html           Practice page (?topic=<id>|mixed&level=1|2|3&seed=<n>)
history.html            Physics history quiz (?cat=<category id>)
css/style.css           All styles
js/core.js              RNG, number formatting, answer parsing, storage, topic registry
js/home.js              Renders the topic grid
js/practice.js          Practice page logic
js/history-data.js      History quiz categories and questions
js/history.js           History quiz logic
js/topics/*.js          One file per topic, each a list of problem templates
assets/favicon.svg
```

## Adding a problem

Open the topic file in `js/topics/` and add an entry to its `problems` array:

```js
{
  title: "Accelerating from rest",
  level: 1, // 1 = Intro, 2 = Standard, 3 = Challenge
  gen(r) {
    const a = r.num(1.5, 6, 0.5), t = r.num(3, 12, 1); // random values on a grid
    const v = a * t;
    return {
      prompt: `A car starts from rest and accelerates at ${qty(a, "m/s^2")} for ${qty(t, "s")}. What is its final speed?`,
      answer: v,
      unit: "m/s",
      hints: [L`Use \(v = v_0 + at\).`],
      solution: [L`\[v = (${fmt(a)})(${fmt(t)}) = ${q(v, "m/s", 3)}\]`],
    };
  },
}
```

- `r.num(min, max, step)`, `r.int(min, max)` and `r.pick(array)` draw from a seeded RNG. Always use these
  instead of `Math.random()` so that share links can reproduce a problem.
- `L` is `String.raw`, so LaTeX backslashes don't need escaping. Use `\( … \)` for inline math and `\[ … \]` for display math.
- `qty(x, unit)` gives inline math such as "9.8 m/s²". `q(x, unit)` gives the same thing without the delimiters, for use inside an equation.
- Unit shortcuts: `deg`, `C` (°C), `Ohm`, `uC`. Anything else is set in upright text.

To add a whole new topic, create `js/topics/<name>.js` using `FIZIKS.addTopic({...})` and add a `<script>` tag for it
to both `index.html` and `practice.html`.

## Adding a history question

Append to `H.questions` in `js/history-data.js`:

```js
{ c: "quantum", q: "Who discovered the neutron in 1932?", a: "James Chadwick",
  w: ["Ernest Rutherford", "Enrico Fermi", "Irène Joliot-Curie"], ex: "Short explanation shown after answering." },
```

`c` must be one of the category ids in `H.categories`, and `w` needs exactly three wrong answers.

## Deploying to GitHub Pages

Settings → Pages → Deploy from branch → choose the branch and `/ (root)`.
