import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

type TestRow = {
  test: TestCase;
  results: TestResult[];
};

export default class TableReporter implements Reporter {
  private readonly outputFolder: string;
  private tests: TestCase[] = [];

  constructor(options: { outputFolder?: string } = {}) {
    this.outputFolder = resolve(options.outputFolder ?? 'playwright-report');
  }

  onBegin(_config: FullConfig, suite: Suite): void {
    this.tests = suite.allTests();
  }

  async onEnd(_result: FullResult): Promise<void> {
    const rows: TestRow[] = this.tests.map((test) => ({
      test,
      results: test.results,
    }));

    await mkdir(this.outputFolder, { recursive: true });
    await writeFile(
      join(this.outputFolder, 'index.html'),
      this.render(rows),
      'utf8',
    );
  }

  printsToStdio(): boolean {
    return false;
  }

  private render(rows: TestRow[]): string {
    const counts = rows.reduce(
      (total, { test }) => {
        total[test.outcome()] += 1;
        return total;
      },
      { expected: 0, unexpected: 0, flaky: 0, skipped: 0 },
    );
    const tableRows = rows
      .map(({ test, results }) => this.renderRow(test, results))
      .join('');

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Playwright Test Results</title>
  <style>
    :root { color-scheme: light; font-family: Arial, sans-serif; color: #24292f; }
    body { margin: 0; padding: 2rem; background: #f6f8fa; }
    main { max-width: 1440px; margin: 0 auto; }
    h1 { margin-top: 0; }
    .summary { margin: 1rem 0; color: #57606a; }
    .report-link { display: inline-block; margin-bottom: 1rem; }
    .table-wrap { overflow-x: auto; background: #fff; border: 1px solid #d0d7de; border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: .75rem; border-bottom: 1px solid #d8dee4; text-align: left; vertical-align: top; }
    th { background: #f6f8fa; white-space: nowrap; }
    tr:last-child td { border-bottom: 0; }
    .status { font-weight: 600; }
    .expected { color: #1a7f37; }
    .unexpected { color: #cf222e; }
    .flaky { color: #9a6700; }
    .skipped { color: #57606a; }
    pre { max-width: 42rem; margin: .4rem 0; white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; }
    .muted { color: #57606a; }
  </style>
</head>
<body>
  <main>
    <h1>Playwright test results</h1>
    <p class="summary">Total: ${rows.length} | Passed: ${counts.expected} | Failed: ${counts.unexpected} | Flaky: ${counts.flaky} | Skipped: ${counts.skipped}</p>
    <a class="report-link" href="details/index.html">Open full Playwright report</a>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Test</th><th>Project</th><th>Status</th><th>Duration by attempt</th><th>Retries</th><th>Errors / attachments</th></tr>
        </thead>
        <tbody>${tableRows || '<tr><td colspan="6">No tests found</td></tr>'}</tbody>
      </table>
    </div>
  </main>
</body>
</html>`;
  }

  private renderRow(test: TestCase, results: TestResult[]): string {
    const outcome = test.outcome();
    const status =
      outcome === 'expected'
        ? 'passed'
        : outcome === 'unexpected'
          ? 'failed'
          : outcome;
    const attemptDurations = results
      .map((result) => `#${result.retry + 1}: ${result.duration} ms`)
      .join('<br>');
    const attemptStatuses =
      results.length > 1
        ? `Attempts: ${results.map((result) => `#${result.retry + 1}: ${result.status}`).join(', ')}`
        : '';
    const errors = results.flatMap((result) =>
      result.errors.map((error) =>
        [error.message, error.stack].filter(Boolean).join('\n'),
      ),
    );
    const attachments = results.flatMap((result) =>
      result.attachments.map(
        (attachment) => `${attachment.name} (${attachment.contentType})`,
      ),
    );
    const details = [
      attemptStatuses,
      ...errors,
      ...attachments.map((attachment) => `Attachment: ${attachment}`),
    ]
      .filter(Boolean)
      .map((detail) => `<pre>${escapeHtml(detail)}</pre>`)
      .join('');
    const title = test.title;
    const project = test.parent?.project()?.name ?? '';

    return `<tr>
  <td>${escapeHtml(title)}</td>
  <td>${escapeHtml(project)}</td>
  <td class="status ${status}">${escapeHtml(status)}</td>
  <td>${attemptDurations || '--'}</td>
  <td>${Math.max(0, results.length - 1)}</td>
  <td>${details || '<span class="muted">--</span>'}</td>
</tr>`;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}
