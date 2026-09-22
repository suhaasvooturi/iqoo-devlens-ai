import type { TestGenOutput } from './types';

export function generateTestSuite(_code: string, framework: string): TestGenOutput {
  const fw = framework.toLowerCase();

  if (fw.includes('python') || fw.includes('pytest')) {
    return {
      framework: 'Pytest (Python)',
      testCasesCount: 5,
      coveredScenarios: [
        'Happy path with valid auth headers',
        'Edge case with empty payload string',
        'Boundary case with timestamp precisely at expiry',
        'Invalid input with non-string and malformed JSON',
        'Regression prevention for issue #104 token truncation',
      ],
      testCategories: {
        happyPath: ['test_parse_jwt_valid_payload()'],
        edgeCases: ['test_parse_jwt_empty_token()'],
        boundaryCases: ['test_parse_jwt_exact_expiry_boundary()'],
        invalidInputs: ['test_parse_jwt_malformed_base64_raises_value_error()'],
        regressionCases: ['test_regression_issue_104_unicode_claims()'],
      },
      testCode: `import pytest
from datetime import datetime, timezone
from auth_service import parse_jwt_claims, AuthException

def test_parse_jwt_valid_payload():
    """Happy path: successfully decodes claims from well-formed JWT."""
    token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3JfMTIzIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyMDgwMDAwMDAwfQ.signature"
    claims = parse_jwt_claims(token)
    assert claims["sub"] == "usr_123"
    assert claims["role"] == "admin"

def test_parse_jwt_empty_token():
    """Edge case: empty string rejected immediately."""
    with pytest.raises(AuthException, match="Token cannot be empty"):
        parse_jwt_claims("")

def test_parse_jwt_exact_expiry_boundary():
    """Boundary case: expired token at threshold boundary."""
    expired_token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3JfMSIsImV4cCI6MTUwMDAwMDAwMH0.sig"
    with pytest.raises(AuthException, match="Token expired"):
        parse_jwt_claims(expired_token)

def test_parse_jwt_malformed_base64():
    """Invalid input: malformed base64 characters raise clear exception."""
    with pytest.raises(ValueError):
        parse_jwt_claims("not-a-token-payload")

def test_regression_issue_104_unicode_claims():
    """Regression case: ensures UTF-8 multibyte characters do not crash buffer."""
    token_with_unicode = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3IiLCJuYW1lIjoiTWFyw61hIn0.sig"
    claims = parse_jwt_claims(token_with_unicode)
    assert claims["name"] == "María"
`,
    };
  }

  if (fw.includes('java') || fw.includes('junit')) {
    return {
      framework: 'JUnit 5 (Java)',
      testCasesCount: 5,
      coveredScenarios: [
        'Happy path testValidTokenClaims()',
        'Edge case testNullTokenThrowsIllegalArgument()',
        'Boundary case testBoundaryExpiryWindow()',
        'Invalid input testMalformedBase64String()',
        'Regression testConcurrencyThreadSafety()',
      ],
      testCategories: {
        happyPath: ['testValidTokenClaims()'],
        edgeCases: ['testNullTokenThrowsIllegalArgument()'],
        boundaryCases: ['testBoundaryExpiryWindow()'],
        invalidInputs: ['testMalformedBase64String()'],
        regressionCases: ['testConcurrencyThreadSafety()'],
      },
      testCode: `package com.devlens.auth;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

class AuthServiceTest {

    private final AuthService authService = new AuthService();

    @Test
    @DisplayName("Happy Path: Parses claims from valid JWT payload")
    void testValidTokenClaims() {
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3JfMTIzIiwicm9sZSI6ImFkbWluIn0.sig";
        Claims claims = authService.parseClaims(token);
        assertEquals("usr_123", claims.getSubject());
        assertEquals("admin", claims.getRole());
    }

    @Test
    @DisplayName("Edge Case: Throws exception on null or blank token")
    void testNullTokenThrowsIllegalArgument() {
        assertThrows(IllegalArgumentException.class, () -> authService.parseClaims(null));
        assertThrows(IllegalArgumentException.class, () -> authService.parseClaims(""));
    }

    @Test
    @DisplayName("Boundary Case: Handles boundary condition on epoch zero")
    void testBoundaryExpiryWindow() {
        String expired = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3IiLCJleHAiOjB9.sig";
        assertThrows(TokenExpiredException.class, () -> authService.parseClaims(expired));
    }

    @Test
    @DisplayName("Invalid Input: Rejects malformed token without 3 segments")
    void testMalformedBase64String() {
        assertThrows(MalformedJwtException.class, () -> authService.parseClaims("malformed.token"));
    }

    @Test
    @DisplayName("Regression: Safe across concurrent multi-threaded decodes")
    void testConcurrencyThreadSafety() {
        assertDoesNotThrow(() -> {
            // Re-entrant verification under pool execution
        });
    }
}
`,
    };
  }

  if (fw.includes('go')) {
    return {
      framework: 'Go test (Golang)',
      testCasesCount: 5,
      coveredScenarios: [
        'TestParseClaims_HappyPath',
        'TestParseClaims_EmptyToken',
        'TestParseClaims_ExpiredBoundary',
        'TestParseClaims_InvalidSegments',
        'TestParseClaims_RegressionUnicode',
      ],
      testCategories: {
        happyPath: ['TestParseClaims_HappyPath'],
        edgeCases: ['TestParseClaims_EmptyToken'],
        boundaryCases: ['TestParseClaims_ExpiredBoundary'],
        invalidInputs: ['TestParseClaims_InvalidSegments'],
        regressionCases: ['TestParseClaims_RegressionUnicode'],
      },
      testCode: `package auth_test

import (
	"testing"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"devlens/auth"
)

func TestParseClaims_HappyPath(t *testing.T) {
	token := "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3JfMTIzIiwicm9sZSI6ImFkbWluIn0.sig"
	claims, err := auth.ParseClaims(token)
	require.NoError(t, err)
	assert.Equal(t, "usr_123", claims.Subject)
	assert.Equal(t, "admin", claims.Role)
}

func TestParseClaims_EmptyToken(t *testing.T) {
	_, err := auth.ParseClaims("")
	assert.ErrorIs(t, err, auth.ErrEmptyToken)
}

func TestParseClaims_ExpiredBoundary(t *testing.T) {
	expiredToken := "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3IiLCJleHAiOjF9.sig"
	_, err := auth.ParseClaims(expiredToken)
	assert.ErrorIs(t, err, auth.ErrTokenExpired)
}

func TestParseClaims_InvalidSegments(t *testing.T) {
	_, err := auth.ParseClaims("part1.part2")
	assert.ErrorIs(t, err, auth.ErrMalformedToken)
}

func TestParseClaims_RegressionUnicode(t *testing.T) {
	token := "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3IiLCJuYW1lIjoiTcO8bGxlciJ9.sig"
	claims, err := auth.ParseClaims(token)
	require.NoError(t, err)
	assert.Equal(t, "Müller", claims.Name)
}
`,
    };
  }

  if (fw.includes('rust') || fw.includes('cargo')) {
    return {
      framework: 'Cargo test (Rust)',
      testCasesCount: 5,
      coveredScenarios: [
        'test_parse_claims_happy_path',
        'test_parse_claims_empty_str',
        'test_parse_claims_expired_boundary',
        'test_parse_claims_corrupted_payload',
        'test_regression_issue_memory_safety',
      ],
      testCategories: {
        happyPath: ['test_parse_claims_happy_path'],
        edgeCases: ['test_parse_claims_empty_str'],
        boundaryCases: ['test_parse_claims_expired_boundary'],
        invalidInputs: ['test_parse_claims_corrupted_payload'],
        regressionCases: ['test_regression_issue_memory_safety'],
      },
      testCode: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_claims_happy_path() {
        let token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3JfMTIzIiwicm9sZSI6ImFkbWluIn0.sig";
        let claims = parse_claims(token).expect("valid token claims");
        assert_eq!(claims.sub, "usr_123");
        assert_eq!(claims.role, "admin");
    }

    #[test]
    fn test_parse_claims_empty_str() {
        let result = parse_claims("");
        assert!(matches!(result, Err(AuthError::EmptyToken)));
    }

    #[test]
    fn test_parse_claims_expired_boundary() {
        let expired = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3IiLCJleHAiOjF9.sig";
        let result = parse_claims(expired);
        assert!(matches!(result, Err(AuthError::TokenExpired)));
    }

    #[test]
    fn test_parse_claims_corrupted_payload() {
        let corrupted = "invalid.token.payload";
        assert!(parse_claims(corrupted).is_err());
    }

    #[test]
    fn test_regression_issue_memory_safety() {
        // Ensures no buffer overrun on large token inputs
        let large_token = "a".repeat(10_000);
        assert!(parse_claims(&large_token).is_err());
    }
}
`,
    };
  }

  // Default: Vitest / Jest (JavaScript / TypeScript)
  return {
    framework: 'Vitest / Jest (TypeScript)',
    testCasesCount: 5,
    coveredScenarios: [
      'Happy path with valid base64 claims payload',
      'Rejects malformed tokens with missing segments',
      'Rejects missing sub or exp claims',
      'Throws on null or non-string inputs',
      'Properly parses expiration timestamp',
    ],
    testCategories: {
      happyPath: ['it("should parse valid claims from JWT")'],
      edgeCases: ['it("should reject token with missing payload segment")'],
      boundaryCases: ['it("should reject token at boundary expiry timestamp")'],
      invalidInputs: ['it("should throw TypeError on null or empty input")'],
      regressionCases: ['it("should prevent prototype pollution in claims JSON")'],
    },
    testCode: `import { describe, it, expect } from 'vitest';
import { parseJwtClaims } from './auth';

describe('parseJwtClaims()', () => {
  const validPayload = btoa(JSON.stringify({ sub: 'user_123', exp: 1798800000, role: 'admin' }));
  const validToken = \`eyJhbGciOiJIUzI1NiJ9.\${validPayload}.somesignature\`;

  it('Happy Path: should successfully parse claims from valid token', () => {
    const claims = parseJwtClaims(validToken);
    expect(claims).toHaveProperty('sub', 'user_123');
    expect(claims).toHaveProperty('role', 'admin');
  });

  it('Edge Case: should throw error if token has fewer than 3 segments', () => {
    expect(() => parseJwtClaims('onlyonepart')).toThrow('Invalid token segments');
  });

  it('Boundary Case: should validate expiration timestamp correctly', () => {
    const expiredPayload = btoa(JSON.stringify({ sub: 'user_1', exp: 100 }));
    expect(() => parseJwtClaims(\`a.\${expiredPayload}.c\`)).toThrow('Token expired');
  });

  it('Invalid Input: should throw on undefined or empty string', () => {
    expect(() => parseJwtClaims('')).toThrow('Token required');
  });

  it('Regression Case: should sanitize against __proto__ injection in claims', () => {
    const maliciousPayload = btoa('{"__proto__":{"polluted":true},"sub":"usr"}');
    const res = parseJwtClaims(\`a.\${maliciousPayload}.c\`);
    expect(res.sub).toBe('usr');
    expect((Object.prototype as any).polluted).toBeUndefined();
  });
});
`,
  };
}
