/**
 * Nexo AI - Semantic Vector Memory & Cosine Similarity Recall Engine
 * 
 * Inspired by 1jehuang/jcode:
 * - Embeds memory notes, user preferences, and conversation turns as semantic vector graphs
 * - Automatically retrieves relevant past context via Cosine Similarity calculations
 * - Zero external API dependency — runs 100% locally and instantaneously on-device
 * 
 * Masterminded & Developed by Tehzeeb (Instagram: @xtehzeeb.x | Support: xtehzeeb.x7@gmail.com)
 */

export class SemanticMemoryEngine {
  constructor(options = {}) {
    this.similarityThreshold = options.threshold || 0.25;
    this.maxRecallItems = options.maxItems || 5;
  }

  /**
   * Tokenizes text into lowercase normalized word terms
   */
  tokenize(text) {
    if (!text || typeof text !== "string") return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  /**
   * Generates a term-frequency vector representation for a text passage
   */
  createVector(text) {
    const tokens = this.tokenize(text);
    const vector = new Map();
    if (tokens.length === 0) return vector;

    for (const token of tokens) {
      vector.set(token, (vector.get(token) || 0) + 1);
    }

    // Normalize vector magnitude
    let sumSq = 0;
    for (const count of vector.values()) {
      sumSq += count * count;
    }
    const magnitude = Math.sqrt(sumSq);

    if (magnitude > 0) {
      for (const [term, count] of vector.entries()) {
        vector.set(term, count / magnitude);
      }
    }

    return vector;
  }

  /**
   * Computes Cosine Similarity between two term-frequency vectors: (A · B) / (||A|| * ||B||)
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.size === 0 || vecB.size === 0) return 0.0;

    let dotProduct = 0;
    const [smaller, larger] = vecA.size <= vecB.size ? [vecA, vecB] : [vecB, vecA];

    for (const [term, valA] of smaller.entries()) {
      const valB = larger.get(term);
      if (valB) {
        dotProduct += valA * valB;
      }
    }

    return dotProduct;
  }

  /**
   * Searches and recalls relevant memories for a user prompt
   * 
   * @param {string} prompt - Current user query
   * @param {Array<{id: string, key: string, value: string, importance: string}>} memories - Stored memories
   * @returns {Array<{memory: object, score: number}>}
   */
  recallRelevantMemories(prompt, memories = []) {
    if (!prompt || !memories || memories.length === 0) return [];

    const queryVec = this.createVector(prompt);
    const scored = [];

    for (const mem of memories) {
      const memText = `${mem.key || ""} ${mem.value || ""}`;
      const memVec = this.createVector(memText);
      const score = this.cosineSimilarity(queryVec, memVec);

      // "always" importance memories are always boosted
      const effectiveScore = mem.importance === "always" ? Math.max(score, 0.99) : score;

      if (effectiveScore >= this.similarityThreshold) {
        scored.push({
          memory: mem,
          score: effectiveScore,
        });
      }
    }

    // Sort by descending score
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, this.maxRecallItems);
  }

  /**
   * Formats recalled memories for injection into the model context
   */
  formatRecallBlock(recalled = []) {
    if (recalled.length === 0) return "";
    const lines = [
      "<NEXO_RECALLED_MEMORY>",
      "The following relevant context from previous sessions was automatically recalled via Semantic Vector Search:",
      ...recalled.map(item => `- [${item.memory.key}]: ${item.memory.value} (relevance: ${(item.score * 100).toFixed(0)}%)`),
      "</NEXO_RECALLED_MEMORY>"
    ];
    return lines.join("\n");
  }
}

export const semanticMemory = new SemanticMemoryEngine();
