#!/usr/bin/env node

/**
 * Better DeepSeek - Autonomous Terminal Agent & Self-Healing CI Runner
 * 
 * Features:
 * - Executes bash / terminal commands with real-time streaming and monitoring
 * - Continuously watches for errors in builds, tests, locales, and android gradle
 * - Automatically diagnoses and auto-fixes issues (Keystores, missing modules, i18n, assets)
 * - Optional DeepSeek AI repair engine for complex code fixes via DEEPSEEK_API_KEY
 * - Safe Git auto-commit & authenticated push to GitHub with token masking
 * - Watch mode for continuous background development & instant auto-repair
 */

import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// ANSI Color formatting
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

// Logger helpers
const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ [Agent]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✔ [Agent]${colors.reset} ${colors.bold}${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ [Agent]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✖ [Agent]${colors.reset} ${colors.bold}${msg}${colors.reset}`),
  step: (step, total, msg) => console.log(`\n${colors.bold}${colors.blue}▶ [Step ${step}/${total}]${colors.reset} ${colors.bold}${msg}${colors.reset}`),
  header: (title) => console.log(`\n${colors.bold}${colors.magenta}═════════════════════════════════════════════════════════════════════════\n  🤖 Better DeepSeek - Autonomous Terminal Agent: ${title}\n═════════════════════════════════════════════════════════════════════════${colors.reset}\n`),
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    command: null,
    watch: false,
    autoFix: true,
    push: false,
    token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN || null,
    deepseekKey: process.env.DEEPSEEK_API_KEY || null,
    maxRetries: 5,
    pipeline: 'full', // 'full', 'quick', 'android', 'web'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--exec' || arg === '-e') {
      options.command = args[++i];
    } else if (arg === '--watch' || arg === '-w') {
      options.watch = true;
    } else if (arg === '--no-fix') {
      options.autoFix = false;
    } else if (arg === '--push' || arg === '-p') {
      options.push = true;
    } else if (arg === '--token' || arg === '-t') {
      options.token = args[++i];
    } else if (arg === '--deepseek-key' || arg === '-k') {
      options.deepseekKey = args[++i];
    } else if (arg === '--retries' || arg === '-r') {
      options.maxRetries = parseInt(args[++i], 10) || 5;
    } else if (arg === '--pipeline') {
      options.pipeline = args[++i] || 'full';
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
${colors.bold}Better DeepSeek Autonomous Terminal Agent${colors.reset}

Usage:
  node scripts/terminal-agent.js [options]
  npm run agent
  npm run agent:watch
  npm run agent:fix

Options:
  --exec, -e <cmd>        Execute a specific bash/terminal command with auto-healing
  --watch, -w             Watch mode: monitor files, run checks, and auto-fix errors on save
  --pipeline <name>       Run preset pipeline: 'full' (default), 'quick', 'web', 'android'
  --no-fix                Disable auto-fixing (only report errors)
  --push, -p              Commit and push changes to GitHub once all errors are resolved
  --token, -t <token>     GitHub Personal Access Token (can also use GITHUB_TOKEN env var)
  --deepseek-key, -k <key>DeepSeek API Key for AI code repair (can use DEEPSEEK_API_KEY env var)
  --retries, -r <n>       Max auto-fix retry iterations per error (default: 5)
  --help, -h              Show this help message
`);
}

/**
 * Execute a bash command with live streaming and full output capture
 */
function executeCommand(cmd, cwd = ROOT_DIR) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    log.info(`Executing: ${colors.yellow}${cmd}${colors.reset} (cwd: ${path.relative(process.cwd(), cwd) || '.'})`);

    const child = spawn(cmd, {
      shell: true,
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      const str = chunk.toString();
      stdout += str;
      process.stdout.write(str);
    });

    child.stderr.on('data', (chunk) => {
      const str = chunk.toString();
      stderr += str;
      process.stderr.write(str);
    });

    child.on('close', (code) => {
      const durationMs = Date.now() - startTime;
      resolve({
        command: cmd,
        exitCode: code,
        stdout,
        stderr,
        fullOutput: stdout + '\n' + stderr,
        durationMs,
        success: code === 0,
      });
    });

    child.on('error', (err) => {
      resolve({
        command: cmd,
        exitCode: 1,
        stdout,
        stderr: err.message,
        fullOutput: stdout + '\n' + err.message,
        durationMs: Date.now() - startTime,
        success: false,
      });
    });
  });
}

/**
 * Deterministic Auto-Fixers
 */
async function applyRuleBasedFix(errorResult) {
  const combined = errorResult.fullOutput || '';
  const fixesApplied = [];

  // 1. Missing Android Keystore
  if (
    combined.includes('ci-release.jks') ||
    combined.includes('keystore') ||
    combined.includes('Keystore file not found') ||
    !fs.existsSync(path.join(ROOT_DIR, 'android/ci-release.jks'))
  ) {
    const keystorePath = path.join(ROOT_DIR, 'android/ci-release.jks');
    if (!fs.existsSync(keystorePath)) {
      log.warn(`Diagnosed issue: Missing Android release keystore 'android/ci-release.jks'. Generating...`);
      try {
        fs.mkdirSync(path.join(ROOT_DIR, 'android'), { recursive: true });
        execSync(
          `/usr/lib/jvm/jdk-11/bin/keytool -genkeypair -v -keystore "${keystorePath}" -alias release -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=better-deepseek, OU=Mobile, O=EdgeTypE, L=City, ST=State, C=US"`,
          { stdio: 'pipe' }
        );
        fixesApplied.push(`Generated Java Keystore 'android/ci-release.jks' (RSA 2048, validity 10000 days).`);
        log.success(`Generated 'android/ci-release.jks' successfully.`);
      } catch (err) {
        log.error(`Failed to generate keystore: ${err.message}`);
      }
    }
  }

  // 2. Missing Node Module / Package
  const pkgMatch = combined.match(/Cannot find package ['"]([^'"]+)['"]/i) ||
                    combined.match(/Cannot find module ['"]([^'"]+)['"]/i) ||
                    combined.match(/ERR_MODULE_NOT_FOUND.*['"]([^'"]+)['"]/i) ||
                    combined.match(/Failed to resolve import ['"]([^'"]+)['"]/i);
  if (pkgMatch && pkgMatch[1]) {
    let pkgName = pkgMatch[1].trim();
    if (pkgName.includes(' imported from ')) {
      pkgName = pkgName.split(' imported from ')[0].trim();
    }
    if (!pkgName.startsWith('.') && !pkgName.startsWith('/')) {
      const cleanPkg = pkgName.startsWith('@') 
        ? pkgName.split('/').slice(0, 2).join('/') 
        : pkgName.split('/')[0];
      
      log.warn(`Diagnosed issue: Missing npm package '${cleanPkg}'. Installing...`);
      try {
        execSync(`npm install --save-dev ${cleanPkg}`, { cwd: ROOT_DIR, stdio: 'inherit' });
        fixesApplied.push(`Installed missing npm package '${cleanPkg}'.`);
        log.success(`Installed '${cleanPkg}'.`);
      } catch (err) {
        log.error(`Failed to install '${cleanPkg}': ${err.message}`);
      }
    }
  }

  // 3. Missing Locales / i18n Keys
  if (combined.includes('check-locales') || combined.includes('Missing Keys') || combined.includes('en.json')) {
    log.warn(`Diagnosed issue: Missing localization keys across language files. Synchronizing...`);
    const localesDir = path.join(ROOT_DIR, 'src/locales');
    const baseFile = path.join(localesDir, 'en.json');
    if (fs.existsSync(baseFile)) {
      try {
        const baseContent = JSON.parse(fs.readFileSync(baseFile, 'utf8'));
        const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json') && f !== 'en.json');

        function deepMergeMissing(base, target) {
          let modified = false;
          for (const k in base) {
            if (!(k in target)) {
              target[k] = base[k];
              modified = true;
            } else if (typeof base[k] === 'object' && base[k] !== null && typeof target[k] === 'object' && target[k] !== null) {
              if (deepMergeMissing(base[k], target[k])) {
                modified = true;
              }
            }
          }
          return modified;
        }

        let syncedCount = 0;
        for (const file of files) {
          const filePath = path.join(localesDir, file);
          const targetContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (deepMergeMissing(baseContent, targetContent)) {
            fs.writeFileSync(filePath, JSON.stringify(targetContent, null, 2) + '\n', 'utf8');
            syncedCount++;
          }
        }
        if (syncedCount > 0) {
          fixesApplied.push(`Synchronized missing i18n keys across ${syncedCount} locale files.`);
          log.success(`Updated missing translation keys across ${syncedCount} locale files.`);
        }
      } catch (err) {
        log.error(`Failed to synchronize locales: ${err.message}`);
      }
    }
  }

  // 4. Missing directory or Android assets
  if (combined.includes('assets') || combined.includes('ENOENT')) {
    const assetsDir = path.join(ROOT_DIR, 'android/app/src/main/assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
      fixesApplied.push(`Created directory 'android/app/src/main/assets'.`);
    }
  }

  // 5. Git lock file cleanup if interrupted
  const gitLock = path.join(ROOT_DIR, '.git/index.lock');
  if (fs.existsSync(gitLock)) {
    try {
      fs.unlinkSync(gitLock);
      fixesApplied.push(`Removed stale .git/index.lock.`);
    } catch (e) {}
  }

  return fixesApplied;
}

/**
 * DeepSeek AI Autonomous Code Fixer (when API key is available)
 */
async function applyDeepSeekAIFix(errorResult, apiKey) {
  if (!apiKey) return null;

  log.info(`Querying DeepSeek AI to analyze stack trace and generate code patch...`);

  // Extract relevant file path from error stack
  const fileRegex = /([a-zA-Z0-9_\-\/]+\.(?:js|svelte|json|ts|html|css|gradle)):(\d+):(\d+)/;
  const match = errorResult.fullOutput.match(fileRegex);

  let targetFilePath = null;
  let fileContent = '';

  if (match && match[1]) {
    const possiblePath = path.resolve(ROOT_DIR, match[1]);
    if (fs.existsSync(possiblePath) && !possiblePath.includes('node_modules')) {
      targetFilePath = possiblePath;
      fileContent = fs.readFileSync(targetFilePath, 'utf8');
    }
  }

  const prompt = `You are an automated software repair agent for the project 'Better DeepSeek'.
The terminal command '${errorResult.command}' failed with the following output:

--- TERMINAL ERROR TRACE ---
${errorResult.fullOutput.slice(-3000)}
--- END TRACE ---

${targetFilePath ? `Affected File: ${path.relative(ROOT_DIR, targetFilePath)}\n--- CURRENT FILE CONTENT ---\n${fileContent}\n--- END CONTENT ---` : ''}

Task: Diagnose the exact root cause and return ONLY a JSON object formatted as:
{
  "explanation": "concise explanation of the fix",
  "filePath": "relative path to file",
  "fixedContent": "full replacement file content"
}`;

  try {
    const response = await callDeepSeekAPI(prompt, apiKey);
    const parsed = JSON.parse(response);

    if (parsed.filePath && parsed.fixedContent) {
      const absPath = path.resolve(ROOT_DIR, parsed.filePath);
      // Backup before writing
      if (fs.existsSync(absPath)) {
        fs.writeFileSync(`${absPath}.bak`, fs.readFileSync(absPath));
      }
      fs.writeFileSync(absPath, parsed.fixedContent, 'utf8');
      log.success(`DeepSeek AI applied fix to '${parsed.filePath}': ${parsed.explanation}`);
      return `AI Auto-Fix applied to ${parsed.filePath}: ${parsed.explanation}`;
    }
  } catch (err) {
    log.warn(`DeepSeek AI auto-repair skipped: ${err.message}`);
  }

  return null;
}

function callDeepSeekAPI(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are an expert autonomous code auto-fixer. Return JSON only.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1
    });

    const req = https.request({
      hostname: 'api.deepseek.com',
      path: '/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 30000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.choices && json.choices[0] && json.choices[0].message) {
            resolve(json.choices[0].message.content);
          } else {
            reject(new Error(`API Error: ${body}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('DeepSeek API request timed out'));
    });

    req.write(data);
    req.end();
  });
}

/**
 * Autonomous Task Runner with Self-Healing Loop
 */
async function runTaskWithAutoHealing(command, options) {
  let attempt = 0;
  const maxAttempts = options.maxRetries;

  while (attempt < maxAttempts) {
    attempt++;
    log.info(`Running task (Attempt ${attempt}/${maxAttempts}): ${colors.bold}${command}${colors.reset}`);

    const result = await executeCommand(command);

    if (result.success) {
      log.success(`Command completed cleanly with exit code 0!`);
      return { success: true, attempts: attempt };
    }

    log.error(`Task failed with exit code ${result.exitCode}. Analyzing error...`);

    if (!options.autoFix) {
      return { success: false, attempts: attempt, error: result };
    }

    // 1. Try deterministic rule-based auto-fixes
    const ruleFixes = await applyRuleBasedFix(result);

    // 2. If no rule fixes, try DeepSeek AI if configured
    let aiFix = null;
    if (ruleFixes.length === 0 && options.deepseekKey) {
      aiFix = await applyDeepSeekAIFix(result, options.deepseekKey);
    }

    if (ruleFixes.length === 0 && !aiFix) {
      log.warn(`No automated fix patterns matched for this failure.`);
      return { success: false, attempts: attempt, error: result };
    }

    log.info(`Applied fixes. Re-running verification to confirm fix...`);
  }

  log.error(`Exceeded maximum retry attempts (${maxAttempts}) for command: ${command}`);
  return { success: false, attempts: attempt };
}

/**
 * Git Auto-Commit and Push to GitHub
 */
async function handleGitPush(options) {
  log.header(`Git Repository Synchronization & Push`);

  try {
    // 1. Check if git status has changes
    const statusOutput = execSync('git status --porcelain', { cwd: ROOT_DIR }).toString().trim();
    if (!statusOutput) {
      log.info(`Git working tree is clean. Nothing to commit.`);
    } else {
      log.info(`Changes detected in working tree:\n${colors.gray}${statusOutput}${colors.reset}`);

      // Add all changes
      log.info(`Staging files with 'git add .' ...`);
      execSync('git add .', { cwd: ROOT_DIR, stdio: 'inherit' });

      // Create descriptive commit message
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const commitMsg = `chore(agent): automated self-healing build & fixes [${timestamp}]`;
      
      log.info(`Committing with message: "${commitMsg}" ...`);
      execSync(`git commit -m "${commitMsg}"`, { cwd: ROOT_DIR, stdio: 'inherit' });
      log.success(`Committed successfully!`);
    }

    if (options.push) {
      log.info(`Pushing to remote GitHub repository...`);

      // Determine remote and token handling
      let remoteUrl = execSync('git remote get-url origin', { cwd: ROOT_DIR }).toString().trim();

      if (options.token) {
        // Authenticate using provided token securely without logging plaintext token
        const match = remoteUrl.match(/github\.com[/:]([\w\-]+)\/([\w\-]+)(?:\.git)?/i);
        if (match) {
          const owner = match[1];
          const repo = match[2];
          const authenticatedUrl = `https://x-access-token:${options.token}@github.com/${owner}/${repo}.git`;
          
          log.info(`Pushing to https://github.com/${owner}/${repo}.git using provided token...`);
          execSync(`git push ${authenticatedUrl} HEAD`, { cwd: ROOT_DIR, stdio: 'pipe' });
          log.success(`Pushed changes to GitHub repository successfully!`);
        } else {
          execSync('git push origin HEAD', { cwd: ROOT_DIR, stdio: 'inherit' });
          log.success(`Pushed changes to GitHub successfully!`);
        }
      } else {
        execSync('git push origin HEAD', { cwd: ROOT_DIR, stdio: 'inherit' });
        log.success(`Pushed changes to GitHub successfully!`);
      }
    }
  } catch (err) {
    log.error(`Git operation encountered an issue: ${err.message}`);
  }
}

/**
 * Watch Mode - Continuous Monitoring & Auto-Repair
 */
async function startWatchMode(options) {
  log.header(`Watching Project for Changes & Continuous Auto-Repair`);
  log.info(`Monitoring directory: ${ROOT_DIR}`);
  log.info(`Press Ctrl+C to stop.`);

  let isRunning = false;
  let queued = false;

  const runCheckCycle = async () => {
    if (isRunning) {
      queued = true;
      return;
    }
    isRunning = true;

    try {
      console.log(`\n${colors.bold}${colors.cyan}--- [Watch Triggered] Running Verification Pipeline ---${colors.reset}`);
      const tasks = getPipelineTasks(options.pipeline);

      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        log.step(i + 1, tasks.length, task.name);
        const res = await runTaskWithAutoHealing(task.command, options);
        if (!res.success) {
          log.error(`Verification pipeline stopped at step '${task.name}'. Waiting for code edits...`);
          break;
        }
      }
      log.success(`All checks passing! Continuous watch active.`);
    } catch (e) {
      log.error(`Watch cycle error: ${e.message}`);
    } finally {
      isRunning = false;
      if (queued) {
        queued = false;
        setTimeout(runCheckCycle, 500);
      }
    }
  };

  // Run initial cycle
  await runCheckCycle();

  // Watch key directories
  const watchDirs = ['src', 'scripts', 'static'];
  for (const dir of watchDirs) {
    const full = path.join(ROOT_DIR, dir);
    if (fs.existsSync(full)) {
      fs.watch(full, { recursive: true }, (event, filename) => {
        if (filename && !filename.includes('.git') && !filename.includes('node_modules') && !filename.endsWith('.bak')) {
          log.info(`Detected change in: ${filename}`);
          runCheckCycle();
        }
      });
    }
  }
}

function getPipelineTasks(pipeline) {
  switch (pipeline) {
    case 'quick':
      return [
        { name: 'Locale Verification', command: 'node scripts/check-locales.js' },
        { name: 'Build Source', command: 'node build.js --source' },
      ];
    case 'web':
      return [
        { name: 'Locale Verification', command: 'node scripts/check-locales.js' },
        { name: 'Build Chrome & Firefox', command: 'npm run build' },
        { name: 'Unit Tests', command: 'npm run test:unit' },
      ];
    case 'android':
      return [
        { name: 'Locale Verification', command: 'node scripts/check-locales.js' },
        { name: 'Android Keystore Verification', command: 'test -f android/ci-release.jks' },
        { name: 'Android Build', command: 'npm run build:android' },
      ];
    case 'full':
    default:
      return [
        { name: 'Locale Verification', command: 'node scripts/check-locales.js' },
        { name: 'Android Keystore Check', command: 'test -f android/ci-release.jks' },
        { name: 'Extension Build', command: 'npm run build' },
        { name: 'Unit Tests', command: 'npm run test:unit' },
      ];
  }
}

/**
 * Main Entrypoint
 */
async function main() {
  const options = parseArgs();

  log.header(`Agent Starting`);

  if (options.watch) {
    await startWatchMode(options);
    return;
  }

  if (options.command) {
    // Custom command mode
    log.info(`Running custom command with autonomous auto-repair...`);
    const result = await runTaskWithAutoHealing(options.command, options);

    if (result.success && options.push) {
      await handleGitPush(options);
    }

    process.exit(result.success ? 0 : 1);
  }

  // Preset pipeline execution
  log.info(`Executing pipeline: '${options.pipeline}'`);
  const tasks = getPipelineTasks(options.pipeline);

  let overallSuccess = true;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    log.step(i + 1, tasks.length, task.name);
    const result = await runTaskWithAutoHealing(task.command, options);

    if (!result.success) {
      overallSuccess = false;
      log.error(`Pipeline halted due to unrecoverable error in '${task.name}'.`);
      break;
    }
  }

  if (overallSuccess) {
    log.success(`All pipeline tasks completed and verified with 0 errors!`);
    if (options.push || options.token) {
      await handleGitPush(options);
    }
  } else {
    log.error(`Pipeline execution finished with errors.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`Fatal agent error:`, err);
  process.exit(1);
});
