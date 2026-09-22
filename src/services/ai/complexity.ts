import type { ComplexityOutput } from './types';

export function calculateComplexity(code: string): ComplexityOutput {
  const loopMatches = code.match(/for\s*\(|while\s*\(|\.forEach\(|\.map\(/g) || [];
  const loopCount = loopMatches.length;
  const isRecursive = code.includes('return ') && (code.includes('fib(') || code.includes('solve(') || code.includes('recurse('));
  const isBinarySearch = (code.includes('mid') || code.includes('>> 1') || code.includes('/ 2')) && code.includes('while');

  if (isRecursive) {
    return {
      timeComplexity: "O(2^N) Exponential",
      spaceComplexity: "O(N) Call Stack",
      timeExplanation: "Unmemoized recursive branching splits into binary recursion trees at each depth step.",
      spaceExplanation: "Maximum stack depth equals N function call frames on the execution thread.",
      hotspotLine: 4,
      scalabilityRating: "Poor",
    };
  }

  if (isBinarySearch) {
    return {
      timeComplexity: "O(log N) Logarithmic",
      spaceComplexity: "O(1) Auxiliary Space",
      timeExplanation: "Search space halves on every loop iteration through midpoint pivot indexing.",
      spaceExplanation: "Operates in-place with low, fixed pointer registers (low, high, mid).",
      hotspotLine: 6,
      scalabilityRating: "Excellent",
    };
  }

  if (loopCount >= 2 || (code.includes('for') && code.includes('includes('))) {
    return {
      timeComplexity: "O(N^2) Quadratic",
      spaceComplexity: "O(1) to O(N)",
      timeExplanation: "Nested iterations perform an inner pass for every element of the outer sequence.",
      spaceExplanation: "Memory footprint remains minimal unless accumulating into an intermediate structure.",
      hotspotLine: 3,
      scalabilityRating: "Moderate",
    };
  }

  if (loopCount === 1) {
    return {
      timeComplexity: "O(N) Linear",
      spaceComplexity: "O(1) Constant",
      timeExplanation: "Single sequential pass through input sequence of size N.",
      spaceExplanation: "Operates in-place with fixed scalar variables.",
      hotspotLine: 2,
      scalabilityRating: "Good",
    };
  }

  return {
    timeComplexity: "O(1) Constant",
    spaceComplexity: "O(1) Constant",
    timeExplanation: "Direct arithmetic, field lookup, or hashing without dynamic iteration.",
    spaceExplanation: "Fixed register allocations without dynamic buffer expansion.",
    hotspotLine: 1,
    scalabilityRating: "Excellent",
  };
}
