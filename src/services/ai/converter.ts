import type { ConverterOutput } from './types';

export function convertCodeSyntax(
  _code: string,
  sourceLang: string,
  targetLang: string
): ConverterOutput {
  const target = targetLang.toLowerCase();

  if (target === 'python') {
    return {
      sourceLang,
      targetLang: 'Python 3',
      notes: [
        'Converted class structure to Pythonic standard with `self` references.',
        'Replaced TypeScript `Map` with native Python `dict` and `time.time()`.',
        'Added PEP-484 type annotations for type checker compliance.',
      ],
      idiomaticNotes: [
        'Converted class structure to Pythonic standard with `self` references.',
        'Replaced TypeScript `Map` with native Python `dict` and `time.time()`.',
        'Added PEP-484 type annotations for type checker compliance.',
      ],
      convertedCode: `import time
from typing import TypeVar, Generic, Optional, Dict, Tuple

K = TypeVar('K')
V = TypeVar('V')

class MemoryStore(Generic[K, V]):
    def __init__(self) -> None:
        self._cache: Dict[K, Tuple[V, float]] = {}

    def set(self, key: K, value: V, ttl_sec: int = 300) -> None:
        expiry = time.time() + ttl_sec
        self._cache[key] = (value, expiry)

    def get(self, key: K) -> Optional[V]:
        if key not in self._cache:
            return None
        val, expiry = self._cache[key]
        if time.time() > expiry:
            del self._cache[key]
            return None
        return val`,
    };
  }

  if (target === 'go') {
    const notes = [
      'Used sync.RWMutex for safe concurrent goroutine access.',
      'Leveraged Go 1.18+ generic type parameters `[K comparable, V any]`.',
      'Implemented idiomatic `(V, bool)` return pattern.',
    ];
    return {
      sourceLang,
      targetLang: 'Golang',
      notes,
      idiomaticNotes: notes,
      convertedCode: `package cache

import (
	"sync"
	"time"
)

type entry[V any] struct {
	val    V
	expiry time.Time
}

type MemoryStore[K comparable, V any] struct {
	mu    sync.RWMutex
	store map[K]entry[V]
}

func NewMemoryStore[K comparable, V any]() *MemoryStore[K, V] {
	return &MemoryStore[K, V]{
		store: make(map[K]entry[V]),
	}
}

func (m *MemoryStore[K, V]) Set(key K, val V, ttl time.Duration) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.store[key] = entry[V]{val: val, expiry: time.Now().Add(ttl)}
}

func (m *MemoryStore[K, V]) Get(key K) (V, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	e, exists := m.store[key]
	if !exists {
		var zero V
		return zero, false
	}
	if time.Now().After(e.expiry) {
		delete(m.store, key)
		var zero V
		return zero, false
	}
	return e.val, true
}`,
    };
  }

  if (target === 'rust') {
    const notes = [
      'Zero-cost abstraction with `std::collections::HashMap` and `std::time::Instant`.',
      'Guarantees thread-safe access with `std::sync::RwLock`.',
      'Explicit `Option<&V>` return pattern avoiding null pointer exceptions.',
    ];
    return {
      sourceLang,
      targetLang: 'Rust',
      notes,
      idiomaticNotes: notes,
      convertedCode: `use std::collections::HashMap;
use std::hash::Hash;
use std::sync::RwLock;
use std::time::{Duration, Instant};

struct CacheEntry<V> {
    value: V,
    expiry: Instant,
}

pub struct MemoryStore<K: Eq + Hash, V> {
    store: RwLock<HashMap<K, CacheEntry<V>>>,
}

impl<K: Eq + Hash, V: Clone> MemoryStore<K, V> {
    pub fn new() -> Self {
        Self {
            store: RwLock::new(HashMap::new()),
        }
    }

    pub fn set(&self, key: K, value: V, ttl: Duration) {
        let mut map = self.store.write().unwrap();
        map.insert(key, CacheEntry {
            value,
            expiry: Instant::now() + ttl,
        });
    }

    pub fn get(&self, key: &K) -> Option<V> {
        let mut map = self.store.write().unwrap();
        if let Some(entry) = map.get(key) {
            if Instant::now() > entry.expiry {
                map.remove(key);
                None
            } else {
                Some(entry.value.clone())
            }
        } else {
            None
        }
    }
}`,
    };
  }

  // Default: TypeScript / JavaScript
  const defaultNotes = [
    'Configured with strict null checking and ES2022 Map semantics.',
    'Includes TypeScript generic constraints `<K, V>`.',
  ];
  return {
    sourceLang,
    targetLang: 'TypeScript',
    notes: defaultNotes,
    idiomaticNotes: defaultNotes,
    convertedCode: `export class MemoryStore<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>();

  set(key: K, value: V, ttlSec = 300): void {
    const expiry = Date.now() + ttlSec * 1000;
    this.cache.set(key, { value, expiry });
  }

  get(key: K): V | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }
}`,
  };
}
