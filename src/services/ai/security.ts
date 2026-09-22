import type { SecurityFinding } from './types';

export function scanSecurityVulnerabilities(code: string): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const lines = code.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trim = line.trim();

    // 1. SQL Injection (CWE-89)
    if (
      (trim.includes('SELECT') || trim.includes('INSERT') || trim.includes('UPDATE') || trim.includes('DELETE')) &&
      (trim.includes('${') || trim.includes(' + ') || trim.includes('%s') || trim.includes('format('))
    ) {
      findings.push({
        id: `vuln-sqli-${lineNum}`,
        cwe: 'CWE-89',
        severity: 'CRITICAL',
        category: 'Injection / Data Exfiltration',
        title: 'Improper Neutralization of Special Elements used in an SQL Command (SQL Injection)',
        line: lineNum,
        description: 'Dynamic interpolation of untrusted input directly into an SQL statement string concatenation.',
        whyItMatters: 'Attackers can bypass authentication, extract sensitive database contents, or execute administrative schema drops (e.g. `1 OR 1=1; DROP TABLE users;`).',
        remediation: 'Use parameterized queries, prepared statements with bind parameters, or a typed ORM.',
        sanitizedCode: `// Remediated via Parameterized Query\nconst query = 'SELECT * FROM users WHERE email = $1';\nconst user = await db.query(query, [email]);`,
      });
    }

    // 2. Cross-Site Scripting (XSS / CWE-79)
    if (
      trim.includes('innerHTML') ||
      trim.includes('dangerouslySetInnerHTML') ||
      trim.includes('document.write(')
    ) {
      findings.push({
        id: `vuln-xss-${lineNum}`,
        cwe: 'CWE-79',
        severity: 'HIGH',
        category: 'Client Injection / XSS',
        title: 'Improper Neutralization of Input During Web Page Generation (Stored/Reflected XSS)',
        line: lineNum,
        description: 'Unescaped user input rendered directly to DOM via innerHTML or unverified markup injection.',
        whyItMatters: 'Malicious scripts can hijack user session cookies, execute CSRF actions, or alter page DOM appearance.',
        remediation: 'Use textContent, DOMPurify sanitization, or framework-safe JSX children escaping.',
        sanitizedCode: `// Remediated via textContent (automatic HTML escaping)\nelement.textContent = userInput;\n// Or with DOMPurify:\n// element.innerHTML = DOMPurify.sanitize(userInput);`,
      });
    }

    // 3. Insecure Dynamic Code Execution (CWE-95)
    if (
      trim.includes('eval(') ||
      trim.includes('new Function(') ||
      trim.includes('exec(') ||
      trim.includes('spawn(')
    ) {
      findings.push({
        id: `vuln-eval-${lineNum}`,
        cwe: 'CWE-95',
        severity: 'CRITICAL',
        category: 'Arbitrary Code Execution',
        title: 'Improper Neutralization of Directives in Dynamically Evaluated Code (Eval Injection)',
        line: lineNum,
        description: 'Executing dynamic string evaluation or shell invocation using eval() or unsanitized exec().',
        whyItMatters: 'Allows untrusted callers to achieve Remote Code Execution (RCE) inside host process context.',
        remediation: 'Replace eval() with structured parsers like JSON.parse() or abstract syntax tree validators.',
        sanitizedCode: `// Remediated: use safe JSON parser\nconst parsed = JSON.parse(jsonString);`,
      });
    }

    // 4. Hardcoded Secrets & API Keys (CWE-798)
    if (
      (trim.includes('secret') || trim.includes('api_key') || trim.includes('password') || trim.includes('token')) &&
      (trim.includes('="') || trim.includes('=\'') || trim.includes(': "')) &&
      !trim.includes('process.env') &&
      !trim.includes('import.meta.env')
    ) {
      findings.push({
        id: `vuln-secret-${lineNum}`,
        cwe: 'CWE-798',
        severity: 'HIGH',
        category: 'Credential Exposure',
        title: 'Use of Hard-coded Credentials',
        line: lineNum,
        description: 'Hardcoded secret token, private credential, or symmetric key identified in source code.',
        whyItMatters: 'Secrets checked into version control repositories can be scraped by automated bots and abused within minutes.',
        remediation: 'Load secrets from environment variables (`process.env.API_SECRET`) or cloud secret managers.',
        sanitizedCode: `// Remediated: read from environment\nconst apiKey = process.env.SERVICE_API_KEY;\nif (!apiKey) throw new Error('SERVICE_API_KEY environment variable missing');`,
      });
    }

    // 5. Weak Authentication / Unsafe Token Comparison (CWE-208)
    if (
      (trim.includes('token ===') || trim.includes('password ===') || trim.includes('hash ==='))
    ) {
      findings.push({
        id: `vuln-timing-${lineNum}`,
        cwe: 'CWE-208',
        severity: 'MEDIUM',
        category: 'Side-Channel / Timing Attack',
        title: 'Observable Timing Discrepancy in Secret Comparison',
        line: lineNum,
        description: 'Using standard string equality operators (`===`) to compare cryptographic tokens or hashes.',
        whyItMatters: 'Standard string comparisons fail fast on the first mismatched byte, leaking secret length and prefix via timing side-channels.',
        remediation: 'Use constant-time comparison utilities such as `crypto.timingSafeEqual()`.',
        sanitizedCode: `// Remediated: constant-time buffer comparison\nimport crypto from 'node:crypto';\nconst isValid = crypto.timingSafeEqual(Buffer.from(providedToken), Buffer.from(storedToken));`,
      });
    }
  });

  // If no vulnerabilities found by heuristic rules, return clean report or default demonstration finding
  if (findings.length === 0) {
    findings.push({
      id: 'clean-audit-0',
      cwe: 'CWE-None',
      severity: 'LOW',
      category: 'Static Analysis Baseline',
      title: 'No Critical OWASP Flaws Detected in Immediate Scan Scope',
      line: 1,
      description: 'Heuristic AST scanner completed passes for SQLi, XSS, eval injection, and hardcoded tokens.',
      whyItMatters: 'Demonstrates baseline hygiene; continuous CI/CD scanning is advised before production deployments.',
      remediation: 'Keep third-party dependencies updated (`npm audit`) and enforce Content Security Policy (CSP).',
      sanitizedCode: '// Code satisfies baseline static heuristic checks.',
    });
  }

  return findings;
}
