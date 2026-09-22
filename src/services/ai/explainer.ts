import type { ExplainerOutput, LineExplanation } from './types';

export function analyzeAndExplain(code: string): ExplainerOutput {
  const lines = code.split('\n');
  const lineByLine: LineExplanation[] = lines.map((line, idx) => {
    let exp = "Executes expression in local scope frame.";
    const trim = line.trim();

    if (trim.startsWith('//') || trim.startsWith('#')) exp = "Developer intent documentation / comment.";
    else if (trim.includes('function') || trim.includes('def ') || trim.includes('=>')) exp = "Declares function signature with parameter contract.";
    else if (trim.includes('return')) exp = "Emits computed result or closure back to the caller.";
    else if (trim.includes('setTimeout') || trim.includes('clearTimeout')) exp = "Schedules or cancels asynchronous timer in host event loop.";
    else if (trim.includes('if ') || trim.includes('while ') || trim.includes('for ')) exp = "Evaluates conditional branching predicate or iteration loop.";
    else if (trim.includes('const ') || trim.includes('let ') || trim.includes('var ')) exp = "Allocates immutable or mutable lexical variable binding.";
    else if (trim.includes('try ') || trim.includes('catch ')) exp = "Error boundary setup to capture uncaught exceptions.";
    else if (trim.includes('await ') || trim.includes('async ')) exp = "Yields coroutine execution until asynchronous promise resolves.";

    return { line: idx + 1, code: line, explanation: exp };
  });

  const isDebounce = code.includes('clearTimeout') || code.includes('setTimeout');
  const isBinarySearch = code.includes('mid') || (code.includes('low') && code.includes('high'));

  let summary = "Executes algorithmic transformation over provided data structures with defensive error controls.";
  let eli5 = "Think of this function like an automated conveyor belt: it inspects incoming parcels, applies the defined operations, and outputs the processed parcel safely.";
  let keyConcepts = ["Lexical Scope", "Control Flow", "Defensive Programming"];

  if (isDebounce) {
    summary = "A higher-order debounce utility. Delays invoking the target callback until after a specified silence duration has passed since the last event.";
    eli5 = "Imagine an elevator. As long as passengers keep pushing the button every 2 seconds, the door stays open. It only closes and moves once people stop entering for the set time!";
    keyConcepts = ["Closures", "Higher-Order Functions", "Event Loop Timers", "Rate Limiting"];
  } else if (isBinarySearch) {
    summary = "A classic divide-and-conquer binary search algorithm operating over sorted collections in logarithmic time.";
    eli5 = "Looking up a word in a dictionary! You flip directly to the middle, check if your word is earlier or later, and throw away half the book on each step until you find it.";
    keyConcepts = ["Logarithmic Complexity O(log N)", "Divide & Conquer", "Sorted Array Invariants"];
  }

  return {
    summary,
    lineByLine,
    eli5,
    keyConcepts,
  };
}
