function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],   // deletion
          dp[i][j - 1],   // insertion
          dp[i - 1][j - 1] // substitution
        );
      }
    }
  }
  return dp[a.length][b.length];
}

// ✅ Keep numbers like 128GB, 50k intact
function isNumeric(token) {
  return /\d/.test(token);
}

// ✅ Correct a single token
function correctToken(token, dictionary) {
  const clean = token.toLowerCase().replace(/[^a-z0-9]/g, "");

  // If empty or numeric, return as-is
  if (!clean || isNumeric(token)) return token.toLowerCase();

  let bestMatch = clean;
  let minDist = Infinity;

  for (const word of dictionary) {
    const dist = levenshtein(clean, word);

    // Adaptive threshold for short words
    const allowedDist = clean.length <= 5 ? 2 : 3;

    if (dist < minDist && dist <= allowedDist) {
      minDist = dist;
      bestMatch = word;
    }
  }

  return bestMatch;
}

// ✅ Correct all tokens in a query
function spellCorrectQuery(query, dictionary) {
  if (!query) return "";

  return query
    .split(/\s+/)
    .map(token => correctToken(token, dictionary))
    .join(" ");
}

module.exports = { spellCorrectQuery };
