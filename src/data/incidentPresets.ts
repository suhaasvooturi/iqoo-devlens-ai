import type { Incident } from '../types';

export const INCIDENT_PRESETS: Incident[] = [
  {
    id: 'inc-nextjs-hydration',
    title: 'Hydration Mismatch & Window Undefined in SSR Header',
    category: 'Hydration / Web',
    framework: 'Next.js 14 / React 19',
    timestamp: '2 mins ago',
    culpritFile: 'src/components/Navigation/Navbar.tsx',
    culpritLine: 42,
    errorType: 'ReferenceError: window is not defined (SSR Bailout)',
    severity: 'HIGH',
    severityScore: 8.4,
    humanSummary:
      "Hey! The server tried to read `window.localStorage` while generating HTML on Node.js, where `window` doesn't exist yet. This blew up the SSR render and made the client discard the server markup. I added an `useEffect` wrapper so localStorage is only touched once the browser mounts safely.",
    voiceBriefing:
      "Hey Suhas, DevLens caught an issue in Navbar.tsx line 42. You're reading localStorage directly during server rendering, where the window object isn't available. I've prepared a safe useEffect hydration guard and verified all 12 tests pass. Ready to push whenever you are.",
    devContext: {
      reportedBy: 'Sentry Alerts (#frontend-ops)',
      timeReported: '2 minutes ago',
      assignee: 'Suhas (Lead Dev)',
      activeBranch: 'feat/navbar-redesign',
    },
    visualPreview: {
      type: 'web',
      brokenStateDescription: '💥 Unhandled Runtime Error: window is not defined. Full screen crash overlay on localhost:3000.',
      fixedStateDescription: '✨ Clean navigation bar rendered with "Member" badge and active auth session.',
      beforeLabel: 'Crash: Red SSR Error Screen',
      afterLabel: 'Fixed: Live Rendered Navbar',
    },
    copilotChat: [
      {
        sender: 'ai',
        text: "Hey Suhas! I caught a hydration crash on `Navbar.tsx` while your test suite ran. You're accessing `window.localStorage` directly in the component body. Node has no `window`, so SSR failed.",
        time: '16:32',
      },
      {
        sender: 'user',
        text: 'Does using useEffect cause any flicker for the user?',
        time: '16:33',
      },
      {
        sender: 'ai',
        text: 'Great question! Because we default `authToken` to `null` on initial render, the server and client HTML match 100%. Once mounted in the browser, `useEffect` sets the token with zero hydration warnings. If you need it instant without layout shift, a cookie-based session with middleware is even better.',
        time: '16:33',
      },
    ],
    rawLog: `Unhandled Runtime Error
ReferenceError: window is not defined
    at Navbar (./src/components/Navigation/Navbar.tsx:42:24)
    at renderWithHooks (react-dom-server.node.development.js:5658:16)
    at renderIndeterminateComponent (react-dom-server.node.development.js:5731:15)
    at renderElement (react-dom-server.node.development.js:5946:7)
    at Array.map (<anonymous>)
    at AppRouteRouteHandlers.render (next/dist/server/app-render/app-render.js:1034:39)

React Hydration Mismatch:
Server HTML did not match client-generated DOM tree in <header class="nav-bar">.
  Expected: ""
  Actual: "token-auth-session-active"`,
    rootCause:
      'Direct access to browser-only `window.localStorage` inside the render body of a Server-Rendered Component. During Next.js SSR build, Node.js environment has no `window` global, causing server compilation crash and client reconciliation mismatch.',
    impactAnalysis:
      'Bails out of static generation; causes full page reload, flash of unstyled header, and unauthenticated redirects for 100% of initial page hits.',
    preventionAdvice:
      'Wrap browser storage calls in `useEffect` or use an isMounted hook pattern / dynamic client-only wrapper.',
    originalCode: `export function Navbar({ title }: { title: string }) {
  // ❌ Defective: Reading window directly in SSR render body
  const authToken = window.localStorage.getItem('iqoo_token');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="nav-bar">
      <div className="brand">{title}</div>
      <div className="auth-badge">{authToken ? 'Member' : 'Guest'}</div>
    </header>
  );
}`,
    fixedCode: `export function Navbar({ title }: { title: string }) {
  // ✅ Fixed: Safe client-side hydration guard with useEffect
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthToken(window.localStorage.getItem('iqoo_token'));
    }
  }, []);

  return (
    <header className="nav-bar">
      <div className="brand">{title}</div>
      <div className="auth-badge">{authToken ? 'Member' : 'Guest'}</div>
    </header>
  );
}`,
    gitDiff: `--- a/src/components/Navigation/Navbar.tsx
+++ b/src/components/Navigation/Navbar.tsx
@@ -40,4 +40,9 @@ export function Navbar({ title }: { title: string }) {
-  // ❌ Defective: Reading window directly in SSR render body
-  const authToken = window.localStorage.getItem('iqoo_token');
+  // ✅ Fixed: Safe client-side hydration guard with useEffect
+  const [authToken, setAuthToken] = useState<string | null>(null);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
+
+  useEffect(() => {
+    if (typeof window !== 'undefined') {
+      setAuthToken(window.localStorage.getItem('iqoo_token'));
+    }
+  }, []);`,
    testSuite: {
      name: 'jest --testPathPattern=Navbar.test.tsx',
      totalTests: 12,
      failingTestName: 'Navbar renders cleanly on SSR without window reference error',
      failingErrorMessage: 'ReferenceError: window is not defined during server render',
      passedBefore: 11,
      failedBefore: 1,
    },
  },
  {
    id: 'inc-fastapi-deadlock',
    title: 'PostgreSQL Connection Pool Exhaustion & Async Loop Lock',
    category: 'Concurrency Deadlock',
    framework: 'FastAPI / Python',
    timestamp: '4 mins ago',
    culpritFile: 'api/routers/telemetry.py',
    culpritLine: 89,
    errorType: 'asyncpg.exceptions.PoolTimeoutError: timeout after 5.00s',
    severity: 'CRITICAL',
    severityScore: 9.6,
    humanSummary:
      "A failed input validation threw an exception before the DB connection was returned, leaking pool connections on every bad request. After 20 errors, the entire pool choked. I switched it to `async with db_pool.acquire()` so cleanup is automatic even if something blows up.",
    voiceBriefing:
      "Alert in telemetry.py: all 20 database connections are occupied. When input validation failed, the connection was leaked instead of released. I've refactored this to use an async with context manager to guarantee connection recycling.",
    devContext: {
      reportedBy: 'Datadog APM Monitor',
      timeReported: '4 minutes ago',
      assignee: 'Suhas (Lead Dev)',
      activeBranch: 'main',
    },
    visualPreview: {
      type: 'api',
      brokenStateDescription: '🔴 HTTP 504 Gateway Timeout: API response time spike from 14ms to 5,000ms+.',
      fixedStateDescription: '🟢 HTTP 200 OK: Sub-12ms response time; connection pool utilization steady at 15%.',
      beforeLabel: 'API Lag: 504 Gateway Timeout',
      afterLabel: 'Fixed: 12ms Response Time',
    },
    copilotChat: [
      {
        sender: 'ai',
        text: 'Critical issue on the telemetry route: 20 invalid requests exhausted the asyncpg pool because exceptions bypassed `db_pool.release(conn)`.',
        time: '16:28',
      },
      {
        sender: 'user',
        text: 'Will this fix prevent pool starvation under high load?',
        time: '16:29',
      },
      {
        sender: 'ai',
        text: 'Yes! The `async with` block uses Python context management, so the connection is guaranteed to return to the pool immediately upon exit, even if validation fails or a client disconnects.',
        time: '16:30',
      },
    ],
    rawLog: `[2026-09-22 16:32:01 +0000] [14022] [ERROR] Exception in ASGI application
Traceback (most recent call last):
  File "/usr/local/lib/python3.11/site-packages/uvicorn/protocols/http/h11_impl.py", line 408, in run_asgi
    result = await app(self.scope, self.receive, self.send)
  File "/app/api/routers/telemetry.py", line 89, in record_device_event
    conn = await db_pool.acquire()
  File "/usr/local/lib/python3.11/site-packages/asyncpg/pool.py", line 482, in acquire
    raise exceptions.PoolTimeoutError('connection pool timeout after 5.00s')
asyncpg.exceptions.PoolTimeoutError: connection pool timeout after 5.00s: all 20 connections occupied`,
    rootCause:
      'Database connection acquired without `async with` context manager inside an uncaught exception branch. When network validation failed, connection was leaked indefinitely rather than returned to asyncpg connection pool.',
    impactAnalysis:
      'All incoming API endpoints hanging. Response latency skyrocketed from 12ms to 5,000ms+; HTTP 504 Gateway Timeouts across mobile clients.',
    preventionAdvice:
      'Always encapsulate connection leases in `async with db_pool.acquire() as conn:` blocks to guarantee pool recycling.',
    originalCode: `@router.post("/telemetry/stream")
async def record_device_event(payload: EventPayload, db_pool: Pool = Depends(get_db)):
    # ❌ Defective: Manual lease without try/finally or async with
    conn = await db_pool.acquire()
    raw_score = calculate_perf_metric(payload)
    if raw_score < 0:
        raise HTTPException(status_code=400, detail="Invalid metric") # 💥 Leaks connection!
    await conn.execute("INSERT INTO telemetry_logs (data) VALUES ($1)", payload.data)
    await db_pool.release(conn)`,
    fixedCode: `@router.post("/telemetry/stream")
async def record_device_event(payload: EventPayload, db_pool: Pool = Depends(get_db)):
    # ✅ Fixed: Context-managed async connection with guaranteed recycling
    raw_score = calculate_perf_metric(payload)
    if raw_score < 0:
        raise HTTPException(status_code=400, detail="Invalid metric")
    
    async with db_pool.acquire() as conn:
        await conn.execute("INSERT INTO telemetry_logs (data) VALUES ($1)", payload.data)`,
    gitDiff: `--- a/api/routers/telemetry.py
+++ b/api/routers/telemetry.py
@@ -87,6 +87,6 @@ async def record_device_event(payload: EventPayload, db_pool: Pool = Depends(get
-    conn = await db_pool.acquire()
     raw_score = calculate_perf_metric(payload)
     if raw_score < 0:
-        raise HTTPException(status_code=400, detail="Invalid metric") # 💥 Leaks connection!
-    await conn.execute("INSERT INTO telemetry_logs (data) VALUES ($1)", payload.data)
-    await db_pool.release(conn)
+        raise HTTPException(status_code=400, detail="Invalid metric")
+    async with db_pool.acquire() as conn:
+        await conn.execute("INSERT INTO telemetry_logs (data) VALUES ($1)", payload.data)`,
    testSuite: {
      name: 'pytest tests/test_telemetry.py -k test_pool_recycle',
      totalTests: 16,
      failingTestName: 'test_pool_recycle_under_rapid_validation_errors',
      failingErrorMessage: 'PoolTimeoutError: connection pool exhausted after 20 invalid requests',
      passedBefore: 15,
      failedBefore: 1,
    },
  },
  {
    id: 'inc-docker-oom',
    title: 'Container OOMKilled (Exit Code 137) via Stream Buffer Accumulation',
    category: 'Memory / OOM',
    framework: 'Docker / Node.js',
    timestamp: '7 mins ago',
    culpritFile: 'workers/logAggregator.js',
    culpritLine: 114,
    errorType: 'Fatal process crash: Exit Code 137 (SIGKILL - Out of Memory)',
    severity: 'CRITICAL',
    severityScore: 9.8,
    humanSummary:
      "The stream reader was pushing incoming socket chunks directly into a raw array without pausing the sender. Fast traffic filled the 512MB RAM limit before garbage collection could run, causing Docker to SIGKILL the worker. I added socket backpressure pauses so producers slow down when disk flushing is underway.",
    voiceBriefing:
      "Docker worker crashed with exit code 137. Chunks accumulated in an unbounded array, exceeding the 512 megabyte memory limit. I added stream backpressure with socket.pause and socket.resume during disk flush.",
    devContext: {
      reportedBy: 'Kubernetes Pod Sentinel',
      timeReported: '7 minutes ago',
      assignee: 'Suhas (Lead Dev)',
      activeBranch: 'infra/worker-stream',
    },
    visualPreview: {
      type: 'docker',
      brokenStateDescription: '🔴 Pod CrashLoopBackOff: Container memory pegged at 518MB / 512MB limit.',
      fixedStateDescription: '🟢 Pod Running: Steady memory footprint at 92MB with smooth backpressure.',
      beforeLabel: 'Crash: OOMKilled 137',
      afterLabel: 'Fixed: 92MB Memory Footprint',
    },
    copilotChat: [
      {
        sender: 'ai',
        text: 'The Docker stream worker was killed by the OS kernel OOM-killer. The `bufferQueue` was growing faster than disk I/O could flush.',
        time: '16:21',
      },
      {
        sender: 'user',
        text: 'Is backpressure better than increasing the Docker RAM limit?',
        time: '16:22',
      },
      {
        sender: 'ai',
        text: 'Definitely! Increasing RAM only delays the inevitable crash if input rate exceeds flush rate. Backpressure forces the network socket to throttle naturally, keeping memory below 100MB permanently.',
        time: '16:23',
      },
    ],
    rawLog: `kernel: [12044.1209] oom-kill:constraint=CONSTRAINT_MEMCG,nodemask=(null),cpuset=docker-7bfa,mems_allowed=0,oom_memcg=/docker/7bfae8293c,task_memcg=/docker/7bfae8293c,task=node,pid=4109,uid=1000
kernel: [12044.1210] Memory cgroup out of memory: Killed process 4109 (node) total-vm:1894220kB, anon-rss:518920kB, file-rss:1220kB
docker container status: container 'iqoo-stream-worker' exited with code 137.
Logs before termination:
  <--- Last few GCs --->
  [4109:0x5220000] 184910 ms: Mark-sweep 508.4 (515.2) -> 504.1 (518.0) MB, 412.8 / 0.0 ms (average mu = 0.112) allocation failure scavenge might not succeed
  FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`,
    rootCause:
      'Unbounded array push inside raw streaming chunk listener without backpressure pause (`stream.pause()`). Fast socket producers flooded the 512MB RAM container heap before garbage collection could sweep.',
    impactAnalysis:
      'Continuous worker crash loops in Kubernetes/Docker swarm; pending telemetry packets lost; restart storms straining the orchestrator.',
    preventionAdvice:
      'Use Node.js pipeline API or stream.on("drain") backpressure handling to throttle incoming chunks.',
    originalCode: `// ❌ Defective: Accumulating infinite chunks in heap memory
const bufferQueue = [];
socket.on('data', (chunk) => {
  bufferQueue.push(chunk); // Floods memory when downstream is slow
  if (bufferQueue.length >= BATCH_LIMIT) {
    flushToDisk(bufferQueue.splice(0, BATCH_LIMIT));
  }
});`,
    fixedCode: `// ✅ Fixed: Controlled stream pipeline with backpressure pause & drain
const bufferQueue = [];
socket.on('data', (chunk) => {
  bufferQueue.push(chunk);
  if (bufferQueue.length >= BATCH_LIMIT) {
    socket.pause(); // Stop sender while flushing
    flushToDisk(bufferQueue.splice(0, BATCH_LIMIT), () => {
      socket.resume(); // Resume stream when buffer clears
    });
  }
});`,
    gitDiff: `--- a/workers/logAggregator.js
+++ b/workers/logAggregator.js
@@ -112,5 +112,7 @@ socket.on('data', (chunk) => {
   bufferQueue.push(chunk);
   if (bufferQueue.length >= BATCH_LIMIT) {
-    flushToDisk(bufferQueue.splice(0, BATCH_LIMIT));
+    socket.pause();
+    flushToDisk(bufferQueue.splice(0, BATCH_LIMIT), () => {
+      socket.resume();
+    });
   }
 });`,
    testSuite: {
      name: 'npm test -- --grep "buffer backpressure load"',
      totalTests: 8,
      failingTestName: 'should limit resident heap under 256MB under high throughput',
      failingErrorMessage: 'MemoryLimitExceeded: Heap memory 518MB exceeded threshold 256MB',
      passedBefore: 7,
      failedBefore: 1,
    },
  },
  {
    id: 'inc-rust-deadlock',
    title: 'Tokio Async Mutex Cross-Lock Deadlock in Event Pipeline',
    category: 'Compilation Crash',
    framework: 'Rust / Tokio',
    timestamp: '11 mins ago',
    culpritFile: 'src/pipeline/dispatcher.rs',
    culpritLine: 67,
    errorType: 'thread tokio-runtime-worker panicked: recursive lock acquisition',
    severity: 'HIGH',
    severityScore: 8.9,
    humanSummary:
      "A mutex lock was held across an `.await` call that wound up calling right back into the same dispatcher. Rust's borrow checker caught the recursive lock attempt and panicked to protect memory safety. I scoped the lock in curly braces so it drops before calling downstream subscribers.",
    voiceBriefing:
      "Tokio async deadlock in dispatcher.rs. The lock guard was kept active while awaiting an external subscriber that re-entered the same method. Scoping the guard drops it cleanly before the await boundary.",
    devContext: {
      reportedBy: 'CI/CD Cargo Test Runner',
      timeReported: '11 minutes ago',
      assignee: 'Suhas (Lead Dev)',
      activeBranch: 'feat/async-pipeline',
    },
    visualPreview: {
      type: 'api',
      brokenStateDescription: '🔴 Worker Thread Panic: Worker threads 0 through 3 frozen awaiting mutex lock.',
      fixedStateDescription: '🟢 Pipeline Active: 14,000 events/sec processed with zero lock contention.',
      beforeLabel: 'Panic: Recursive Borrow',
      afterLabel: 'Fixed: Zero Lock Contention',
    },
    copilotChat: [
      {
        sender: 'ai',
        text: "Tokio worker thread panicked: recursive lock acquisition. You're holding `state.lock().await` while calling `notify_subscribers`, which re-locks state.",
        time: '16:15',
      },
      {
        sender: 'user',
        text: 'Can we use an mpsc channel instead of a mutex?',
        time: '16:16',
      },
      {
        sender: 'ai',
        text: 'That is the ideal long-term architecture! For a zero-regression hotfix right now, scoping the lock guard in `{ ... }` drops it before `notify_subscribers.await`, fixing the immediate deadlock without refactoring subscriber structs.',
        time: '16:17',
      },
    ],
    rawLog: `thread 'tokio-runtime-worker-3' panicked at src/pipeline/dispatcher.rs:67:23:
cannot borrow \`state\` as mutable more than once at a time
stack backtrace:
   0: rust_begin_unwind
             at /rustc/07dca489ac12be496357e8e00/library/std/src/panicking.rs:645:5
   1: core::panicking::panic_fmt
             at /rustc/07dca489ac12be496357e8e00/library/core/src/panicking.rs:72:14
   2: iqoo_dispatcher::pipeline::dispatcher::dispatch_event
             at ./src/pipeline/dispatcher.rs:67:23
   3: tokio::runtime::task::core::CoreStage::poll
             at /root/.cargo/registry/src/tokio-1.38.0/src/runtime/task/core.rs:328:13`,
    rootCause:
      'Holding an active `Arc<tokio::sync::Mutex<State>>` guard across an `.await` boundary which subsequently re-invoked `dispatch_event`, triggering a self-deadlock / borrow panic.',
    impactAnalysis:
      'All background async workers freeze; worker threads deadlocked in Tokio task scheduler; message queue builds indefinitely.',
    preventionAdvice:
      'Release the lock guard before invoking downstream async functions or structure state using message-passing channels (mpsc).',
    originalCode: `pub async fn dispatch_event(&self, event: Event) {
    // ❌ Defective: Holding guard across downstream await
    let mut state = self.state.lock().await;
    state.events_processed += 1;
    self.notify_subscribers(&event).await; // Re-acquires self.state.lock()!
}`,
    fixedCode: `pub async fn dispatch_event(&self, event: Event) {
    // ✅ Fixed: Drop lock before awaiting external subscriber notification
    {
        let mut state = self.state.lock().await;
        state.events_processed += 1;
    } // Guard dropped here!
    self.notify_subscribers(&event).await;
}`,
    gitDiff: `--- a/src/pipeline/dispatcher.rs
+++ b/src/pipeline/dispatcher.rs
@@ -65,4 +65,6 @@ pub async fn dispatch_event(&self, event: Event) {
-    let mut state = self.state.lock().await;
-    state.events_processed += 1;
+    {
+        let mut state = self.state.lock().await;
+        state.events_processed += 1;
+    }
     self.notify_subscribers(&event).await;
 }`,
    testSuite: {
      name: 'cargo test test_concurrent_dispatch',
      totalTests: 18,
      failingTestName: 'test_reentrant_event_dispatch',
      failingErrorMessage: 'Panicked at cannot borrow state as mutable more than once',
      passedBefore: 17,
      failedBefore: 1,
    },
  },
  {
    id: 'inc-android-kotlin',
    title: 'MainThread NetworkOnMainThread / Coroutine ViewBinding Crash',
    category: 'Runtime Error',
    framework: 'Android Kotlin',
    timestamp: '15 mins ago',
    culpritFile: 'app/src/main/java/com/iqoo/devtools/PerfActivity.kt',
    culpritLine: 74,
    errorType: 'android.os.NetworkOnMainThreadException: IO on Dispatchers.Main',
    severity: 'HIGH',
    severityScore: 8.7,
    humanSummary:
      "A synchronous OkHttp network call was fired inside `lifecycleScope` without switching dispatchers, causing Android OS StrictMode to kill the process on launch. I wrapped the network execution in `withContext(Dispatchers.IO)` so the UI thread stays fluid at 144Hz.",
    voiceBriefing:
      "Android crash in PerfActivity.kt line 74. An OkHttp call was executed on the Main dispatcher, triggering StrictMode NetworkOnMainThreadException. I've offloaded the call to Dispatchers.IO to maintain 144 Hertz frame rates.",
    devContext: {
      reportedBy: 'Firebase Crashlytics',
      timeReported: '15 minutes ago',
      assignee: 'Suhas (Lead Dev)',
      activeBranch: 'feature/iqoo-perf-view',
    },
    visualPreview: {
      type: 'mobile',
      brokenStateDescription: '🔴 App Crash Dialog: "Unfortunately, iQOO DevTools has stopped."',
      fixedStateDescription: '🟢 Fluid 144Hz Monster Mode: Telemetry dashboard rendered with live device metrics.',
      beforeLabel: 'Crash: NetworkOnMainThread',
      afterLabel: 'Fixed: Fluid 144Hz UI',
    },
    copilotChat: [
      {
        sender: 'ai',
        text: "Android StrictMode killed the app: `NetworkOnMainThreadException`. OkHttp's `.execute()` was called directly on `Dispatchers.Main`.",
        time: '16:10',
      },
      {
        sender: 'user',
        text: 'Should we use Retrofit with suspend functions instead?',
        time: '16:11',
      },
      {
        sender: 'ai',
        text: 'Retrofit suspend functions automatically handle Dispatchers.IO under the hood, which is ideal! For this direct OkHttpClient call, `withContext(Dispatchers.IO)` completely eliminates the crash while keeping your exact response parsing.',
        time: '16:12',
      },
    ],
    rawLog: `FATAL EXCEPTION: main
Process: com.iqoo.devtools, PID: 18920
android.os.NetworkOnMainThreadException
    at android.os.StrictMode$AndroidBlockGuardPolicy.onNetwork(StrictMode.java:1605)
    at java.net.Inet6AddressImpl.lookupHostByName(Inet6AddressImpl.java:115)
    at java.net.InetAddress.getAllByNameImpl(InetAddress.java:345)
    at okhttp3.Dns.lambda$static$0(Dns.java:40)
    at okhttp3.internal.connection.RouteSelector.resetNextInetSocketAddress(RouteSelector.kt:164)
    at com.iqoo.devtools.PerfActivity$onCreate$1.invokeSuspend(PerfActivity.kt:74)`,
    rootCause:
      'Synchronous HTTP payload fetch launched directly inside lifecycleScope without specifying `Dispatchers.IO`. Android OS StrictMode instantly kills the application process to prevent UI freezing on high refresh rate displays.',
    impactAnalysis:
      'Immediate app crash on launch for 100% of mobile users; ANR rate spikes on Google Play Console.',
    preventionAdvice:
      'Always switch coroutine context using `withContext(Dispatchers.IO)` before performing blocking network or file I/O.',
    originalCode: `lifecycleScope.launch {
    // ❌ Defective: Running blocking OkHttp network call directly on Main thread
    val telemetryResponse = okHttpClient.newCall(request).execute()
    binding.statusText.text = telemetryResponse.body?.string()
}`,
    fixedCode: `lifecycleScope.launch {
    // ✅ Fixed: Dispatch IO off the main thread, switch back for UI update
    val responseBody = withContext(Dispatchers.IO) {
        okHttpClient.newCall(request).execute().body?.string()
    }
    binding.statusText.text = responseBody
}`,
    gitDiff: `--- a/app/src/main/java/com/iqoo/devtools/PerfActivity.kt
+++ b/app/src/main/java/com/iqoo/devtools/PerfActivity.kt
@@ -72,3 +72,5 @@ lifecycleScope.launch {
-    val telemetryResponse = okHttpClient.newCall(request).execute()
-    binding.statusText.text = telemetryResponse.body?.string()
+    val responseBody = withContext(Dispatchers.IO) {
+        okHttpClient.newCall(request).execute().body?.string()
+    }
     binding.statusText.text = responseBody
 }`,
    testSuite: {
      name: './gradlew testDebugUnitTest',
      totalTests: 14,
      failingTestName: 'test_telemetry_fetch_does_not_block_main_thread',
      failingErrorMessage: 'NetworkOnMainThreadException thrown during activity setup',
      passedBefore: 13,
      failedBefore: 1,
    },
  },
];
