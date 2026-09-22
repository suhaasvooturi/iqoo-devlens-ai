import type { DocGenOutput } from './types';

export function generateDocumentation(_code: string, format: 'jsdoc' | 'docstring' | 'markdown'): DocGenOutput {
  if (format === 'markdown') {
    return {
      format: 'markdown',
      summary: 'Markdown API & Component Technical Reference',
      documentedCode: `# API Reference: \`MemoryStore<K, V>\`\n\nHigh-performance in-memory key-value store with time-to-live (TTL) expiration guarantees.\n\n### Methods\n\n| Method | Parameters | Returns | Description |\n| :--- | :--- | :--- | :--- |\n| \`set\` | \`key: K, value: V, ttlSec?: number\` | \`void\` | Stores entry with TTL in seconds (default 300s). |\n| \`get\` | \`key: K\` | \`V \\| null\` | Retrieves value if valid; purges expired entries automatically. |\n| \`clear\` | - | \`void\` | Clears all active cache entries. |\n\n### Usage Example\n\`\`\`typescript\nimport { MemoryStore } from './cache';\n\nconst cache = new MemoryStore<string, { role: string }>();\ncache.set('session_usr_123', { role: 'admin' }, 60);\nconst session = cache.get('session_usr_123');\nconsole.log(session?.role); // 'admin'\n\`\`\``,
    };
  }

  if (format === 'docstring') {
    return {
      format: 'docstring',
      summary: 'Python PEP-257 compliant docstring specifications',
      documentedCode: `class MemoryStore:\n    """In-memory key-value cache with automatic TTL expiration.\n\n    Attributes:\n        ttl_seconds (int): Default duration in seconds before keys expire.\n    """\n\n    def set(self, key: str, value: any, ttl_seconds: int = 300) -> None:\n        """Stores a key-value pair with an expiration deadline.\n\n        Args:\n            key: Unique dictionary identifier.\n            value: Serializable payload.\n            ttl_seconds: Time to live in seconds.\n        """\n        pass\n\n    def get(self, key: str) -> any:\n        """Retrieves entry value or None if expired.\n\n        Args:\n            key: Target identifier to query.\n\n        Returns:\n            Cached value if unexpired, else None.\n        """\n        pass`,
    };
  }

  // Default: JSDoc
  return {
    format: 'jsdoc',
    summary: 'Typed JSDoc annotated code with param specifications',
    documentedCode: `/**
 * High-performance in-memory key-value cache with automatic TTL expiration.
 * @template K Type of key
 * @template V Type of value
 */
export class MemoryStore<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>();

  /**
   * Stores a key-value entry with an expiration deadline.
   * @param key Unique cache key
   * @param value Stored value
   * @param ttlSec Time-to-live in seconds (defaults to 300s)
   * @returns void
   */
  set(key: K, value: V, ttlSec: number = 300): void {
    const expiry = Date.now() + ttlSec * 1000;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Retrieves an entry if unexpired; automatically evicts stale keys.
   * @param key Cache key to look up
   * @returns Cached value or null if key does not exist or has expired
   */
  get(key: K): V | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }
}`,
  };
}
