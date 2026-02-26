# Grade Range Chart: Zero-Width Bar Handling

## Problem

The "Grade ranges" bar chart uses Recharts `<Bar dataKey="range">` with `[min, max]` tuples. When a team's min and max grades are identical (e.g. only one source graded that team), the bar has zero height and is invisible. The tooltip also redundantly shows "A- to A-".

This happens in two scenarios:
1. **All teams** have one source -- every bar is invisible, chart is useless
2. **Individual teams** have one source while others have real ranges -- specific bars disappear

## Solution

### 1. Hide chart when single source globally

If every team in the dataset has exactly one `draftGrade`, skip rendering the chart entirely. The existing `{gradeRanges && ...}` guard already handles this -- just set `gradeRanges` to `null`.

### 2. Artificial minimum spread for zero-range teams

When `min === max`, nudge the range to `[value - 0.05, value + 0.05]`, clamped to `[0, 4.3]`. On the 0--4.3 scale this creates a thin visible bar (~2.3% of the axis) that reads as "narrow range" rather than "no data".

### 3. Single-grade tooltip

When the two ends of the range map to the same letter grade (via `gradeToLetter()`), show one badge instead of "X to X". The +/-0.05 nudge stays within a single letter grade boundary, so `gradeToLetter()` comparison works directly on the stored range values.

## Scope

All changes in `apps/mmd-public/src/app/page.tsx`:

| Change | Location | Detail |
|--------|----------|--------|
| Hide chart for single-source | `useEffect` ~line 81 | Early return if all teams have 1 grade |
| Minimum bar spread | `useEffect` ~line 88 | `min === max` -> `[v-0.05, v+0.05]` clamped |
| Single-grade tooltip | Tooltip ~line 462 | Conditional single-badge render |

## Approach chosen over alternatives

- **Custom SVG shape renderer**: More complex, requires handling both mobile/desktop layouts separately
- **ComposedChart + Scatter overlay**: Bigger refactor, mixed visual metaphor
- **Artificial spread** was chosen for simplicity -- no custom rendering, tooltip stays accurate, minimal code change
