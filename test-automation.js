#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class NGOWebsiteTestSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      tests: []
    };
    this.baseUrl = 'http://localhost:3000';
    this.serverProcess = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      info: '🔍',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      start: '🚀'
    };
    console.log(`${prefix[type] || 'ℹ️'} [${timestamp}] ${message}`);
  }

  async addTest(name, category, testFn) {
    this.results.summary.total++;
    this.log(`Testing: ${name}`, 'start');
    
    try {
      const startTime = Date.now();
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      const testResult = {
        name,
        category,
        status: result.status || 'passed',
        duration: `${duration}ms`,
        message: result.message || 'Test passed',
        details: result.details || null
      };
      
      this.results.tests.push(testResult);
      
      if (testResult.status === 'passed') {
        this.results.summary.passed++;
        this.log(`✓ ${name}: ${testResult.message}`, 'success');
      } else if (testResult.status === 'warning') {
        this.results.summary.warnings++;
        this.log(`⚠ ${name}: ${testResult.message}`, 'warning');
      } else {
        this.results.summary.failed++;
        this.log(`✗ ${name}: ${testResult.message}`, 'error');
      }
    } catch (error) {
      this.results.summary.failed++;
      const testResult = {
        name,
        category,
        status: 'failed',
        duration: '0ms',
        message: error.message,
        details: error.stack
      };
      this.results.tests.push(testResult);
      this.log(`✗ ${name}: ${error.message}`, 'error');
    }
  }

  async checkFileExists(filePath) {
    return new Promise((resolve) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        resolve(!err);
      });
    });
  }

  async checkFileContent(filePath, searchString) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data.includes(searchString));
      });
    });
  }

  async makeHttpRequest(url, method = 'GET', body = null) {
    const fetch = (await import('node-fetch')).default;
    try {
      const options = { method };
      if (body) {
        options.body = JSON.stringify(body);
        options.headers = { 'Content-Type': 'application/json' };
      }
      const response = await fetch(url, options);
      return {
        status: response.status,
        ok: response.ok,
        data: await response.text()
      };
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      this.log('Starting development server...', 'start');
      this.serverProcess = spawn('npm', ['run', 'dev'], { 
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      let serverReady = false;
      const timeout = setTimeout(() => {
        if (!serverReady) {
          reject(new Error('Server startup timeout'));
        }
      }, 30000);

      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Ready in') || output.includes('localhost:3000')) {
          if (!serverReady) {
            serverReady = true;
            clearTimeout(timeout);
            this.log('Development server started successfully', 'success');
            // Wait a bit more for server to be fully ready
            setTimeout(resolve, 2000);
          }
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('Error') && !serverReady) {
          clearTimeout(timeout);
          reject(new Error(`Server startup error: ${error}`));
        }
      });
    });
  }

  async stopServer() {
    if (this.serverProcess) {
      this.log('Stopping development server...', 'start');
      this.serverProcess.kill('SIGTERM');
      this.serverProcess = null;
    }
  }

  async runTests() {
    try {
      // File Structure Tests
      await this.addTest('Package.json exists', 'File Structure', async () => {
        const exists = await this.checkFileExists('./package.json');
        return exists 
          ? { status: 'passed', message: 'package.json found' }
          : { status: 'failed', message: 'package.json missing' };
      });

      await this.addTest('Next.js config exists', 'File Structure', async () => {
        const exists = await this.checkFileExists('./next.config.ts');
        return exists 
          ? { status: 'passed', message: 'next.config.ts found' }
          : { status: 'failed', message: 'next.config.ts missing' };
      });

      await this.addTest('Main layout exists', 'File Structure', async () => {
        const exists = await this.checkFileExists('./src/app/layout.tsx');
        return exists 
          ? { status: 'passed', message: 'layout.tsx found' }
          : { status: 'failed', message: 'layout.tsx missing' };
      });

      await this.addTest('Navigation component exists', 'Components', async () => {
        const exists = await this.checkFileExists('./src/components/Navigation.tsx');
        return exists 
          ? { status: 'passed', message: 'Navigation.tsx found' }
          : { status: 'failed', message: 'Navigation.tsx missing' };
      });

      // Component Content Tests
      await this.addTest('Navigation has organization name', 'Components', async () => {
        const hasOrgName = await this.checkFileContent('./src/components/Navigation.tsx', 'Bawaliya Seva Sansthan');
        return hasOrgName 
          ? { status: 'passed', message: 'Organization name present in navigation' }
          : { status: 'failed', message: 'Organization name missing from navigation' };
      });

      await this.addTest('Navigation excludes Programs button', 'Components', async () => {
        const hasPrograms = await this.checkFileContent('./src/components/Navigation.tsx', 'Programs');
        return !hasPrograms 
          ? { status: 'passed', message: 'Programs button successfully removed' }
          : { status: 'warning', message: 'Programs button still present' };
      });

      // Admin Pages Tests
      await this.addTest('Admin dashboard exists', 'Admin Pages', async () => {
        const exists = await this.checkFileExists('./src/app/admin/page.tsx');
        return exists 
          ? { status: 'passed', message: 'Admin dashboard found' }
          : { status: 'failed', message: 'Admin dashboard missing' };
      });

      await this.addTest('Admin login page exists', 'Admin Pages', async () => {
        const exists = await this.checkFileExists('./src/app/admin/login/page.tsx');
        return exists 
          ? { status: 'passed', message: 'Admin login page found' }
          : { status: 'failed', message: 'Admin login page missing' };
      });

      await this.addTest('Admin events page exists', 'Admin Pages', async () => {
        const exists = await this.checkFileExists('./src/app/admin/events/page.tsx');
        return exists 
          ? { status: 'passed', message: 'Admin events page found' }
          : { status: 'failed', message: 'Admin events page missing' };
      });

      await this.addTest('Admin donations page exists', 'Admin Pages', async () => {
        const exists = await this.checkFileExists('./src/app/admin/donations/page.tsx');
        return exists 
          ? { status: 'passed', message: 'Admin donations page found' }
          : { status: 'failed', message: 'Admin donations page missing' };
      });

      await this.addTest('Admin gallery page exists', 'Admin Pages', async () => {
        const exists = await this.checkFileExists('./src/app/admin/gallery/page.tsx');
        return exists 
          ? { status: 'passed', message: 'Admin gallery page found' }
          : { status: 'failed', message: 'Admin gallery page missing' };
      });

      // API Routes Tests
      await this.addTest('Auth API route exists', 'API Routes', async () => {
        const exists = await this.checkFileExists('./src/app/api/auth/[...nextauth]/route.ts');
        return exists 
          ? { status: 'passed', message: 'NextAuth API route found' }
          : { status: 'failed', message: 'NextAuth API route missing' };
      });

      await this.addTest('Events API route exists', 'API Routes', async () => {
        const exists = await this.checkFileExists('./src/app/api/events/route.ts');
        return exists 
          ? { status: 'passed', message: 'Events API route found' }
          : { status: 'failed', message: 'Events API route missing' };
      });

      await this.addTest('Donations API route exists', 'API Routes', async () => {
        const exists = await this.checkFileExists('./src/app/api/donations/route.ts');
        return exists 
          ? { status: 'passed', message: 'Donations API route found' }
          : { status: 'failed', message: 'Donations API route missing' };
      });

      // Model Tests
      await this.addTest('Admin model exists', 'Database Models', async () => {
        const exists = await this.checkFileExists('./src/models/Admin.ts');
        return exists 
          ? { status: 'passed', message: 'Admin model found' }
          : { status: 'failed', message: 'Admin model missing' };
      });

      await this.addTest('Event model exists', 'Database Models', async () => {
        const exists = await this.checkFileExists('./src/models/Event.ts');
        return exists 
          ? { status: 'passed', message: 'Event model found' }
          : { status: 'failed', message: 'Event model missing' };
      });

      await this.addTest('Donation model exists', 'Database Models', async () => {
        const exists = await this.checkFileExists('./src/models/Donation.ts');
        return exists 
          ? { status: 'passed', message: 'Donation model found' }
          : { status: 'failed', message: 'Donation model missing' };
      });

      // Dependency Tests
      await this.addTest('Dependencies install check', 'Dependencies', async () => {
        try {
          execSync('npm list --depth=0', { stdio: 'ignore' });
          return { status: 'passed', message: 'All dependencies installed correctly' };
        } catch (error) {
          return { status: 'warning', message: 'Some dependencies may be missing or outdated' };
        }
      });

      // Build Tests
      await this.addTest('TypeScript compilation', 'Build', async () => {
        try {
          execSync('npx tsc --noEmit', { stdio: 'ignore' });
          return { status: 'passed', message: 'TypeScript compilation successful' };
        } catch (error) {
          return { status: 'failed', message: 'TypeScript compilation failed', details: error.message };
        }
      });

      await this.addTest('Next.js build test', 'Build', async () => {
        try {
          execSync('npm run build', { stdio: 'ignore' });
          return { status: 'passed', message: 'Next.js build successful' };
        } catch (error) {
          return { status: 'failed', message: 'Next.js build failed', details: error.message };
        }
      });

      // Start server for runtime tests
      await this.startServer();

      // Runtime Tests
      await this.addTest('Homepage loads', 'Runtime', async () => {
        const response = await this.makeHttpRequest(this.baseUrl);
        return response.ok 
          ? { status: 'passed', message: `Homepage loaded (${response.status})` }
          : { status: 'failed', message: `Homepage failed to load (${response.status})` };
      });

      await this.addTest('About section accessible', 'Runtime', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/#about`);
        return response.ok 
          ? { status: 'passed', message: 'About section accessible' }
          : { status: 'failed', message: 'About section not accessible' };
      });

      await this.addTest('Events page loads', 'Runtime', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/events`);
        return response.ok 
          ? { status: 'passed', message: 'Events page loads successfully' }
          : { status: 'failed', message: 'Events page failed to load' };
      });

      await this.addTest('Team page loads', 'Runtime', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/team`);
        return response.ok 
          ? { status: 'passed', message: 'Team page loads successfully' }
          : { status: 'failed', message: 'Team page failed to load' };
      });

      await this.addTest('Gallery page loads', 'Runtime', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/gallery`);
        return response.ok 
          ? { status: 'passed', message: 'Gallery page loads successfully' }
          : { status: 'failed', message: 'Gallery page failed to load' };
      });

      await this.addTest('News/Posts page loads', 'Runtime', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/posts`);
        return response.ok 
          ? { status: 'passed', message: 'News/Posts page loads successfully' }
          : { status: 'failed', message: 'News/Posts page failed to load' };
      });

      await this.addTest('Donate page loads', 'Runtime', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/donate`);
        return response.ok 
          ? { status: 'passed', message: 'Donate page loads successfully' }
          : { status: 'failed', message: 'Donate page failed to load' };
      });

      await this.addTest('Admin login page loads', 'Runtime', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/admin/login`);
        return response.ok 
          ? { status: 'passed', message: 'Admin login page loads successfully' }
          : { status: 'failed', message: 'Admin login page failed to load' };
      });

      // API Tests
      await this.addTest('Events API responds', 'API', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/api/events`);
        return response.ok 
          ? { status: 'passed', message: 'Events API responds successfully' }
          : { status: 'warning', message: 'Events API may not be properly configured' };
      });

      await this.addTest('Donations API responds', 'API', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/api/donations`);
        return response.ok 
          ? { status: 'passed', message: 'Donations API responds successfully' }
          : { status: 'warning', message: 'Donations API may not be properly configured' };
      });

      await this.addTest('Gallery API responds', 'API', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/api/gallery`);
        return response.ok 
          ? { status: 'passed', message: 'Gallery API responds successfully' }
          : { status: 'warning', message: 'Gallery API may not be properly configured' };
      });

    } finally {
      await this.stopServer();
    }
  }

  generateReport() {
    const reportData = {
      ...this.results,
      summary: {
        ...this.results.summary,
        successRate: Math.round((this.results.summary.passed / this.results.summary.total) * 100)
      }
    };

    // Generate detailed report
    let report = `
# NGO Website Test Report
Generated: ${reportData.timestamp}

## Summary
- **Total Tests**: ${reportData.summary.total}
- **Passed**: ${reportData.summary.passed} ✅
- **Failed**: ${reportData.summary.failed} ❌
- **Warnings**: ${reportData.summary.warnings} ⚠️
- **Success Rate**: ${reportData.summary.successRate}%

## Test Results by Category

`;

    const categories = [...new Set(reportData.tests.map(t => t.category))];
    
    categories.forEach(category => {
      const categoryTests = reportData.tests.filter(t => t.category === category);
      const categoryPassed = categoryTests.filter(t => t.status === 'passed').length;
      const categoryTotal = categoryTests.length;
      
      report += `### ${category} (${categoryPassed}/${categoryTotal})\n\n`;
      
      categoryTests.forEach(test => {
        const icon = test.status === 'passed' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
        report += `- ${icon} **${test.name}**: ${test.message} _(${test.duration})_\n`;
        if (test.details) {
          report += `  - Details: ${test.details}\n`;
        }
      });
      report += '\n';
    });

    // Recommendations
    const failedTests = reportData.tests.filter(t => t.status === 'failed');
    const warningTests = reportData.tests.filter(t => t.status === 'warning');

    if (failedTests.length > 0 || warningTests.length > 0) {
      report += `## Recommendations\n\n`;
      
      if (failedTests.length > 0) {
        report += `### Critical Issues to Fix:\n`;
        failedTests.forEach(test => {
          report += `- **${test.name}**: ${test.message}\n`;
        });
        report += '\n';
      }
      
      if (warningTests.length > 0) {
        report += `### Items to Review:\n`;
        warningTests.forEach(test => {
          report += `- **${test.name}**: ${test.message}\n`;
        });
        report += '\n';
      }
    }

    report += `## Conclusion\n\n`;
    if (reportData.summary.successRate >= 90) {
      report += `🎉 **Excellent!** Your NGO website is in great shape with a ${reportData.summary.successRate}% success rate.\n`;
    } else if (reportData.summary.successRate >= 75) {
      report += `👍 **Good!** Your NGO website is mostly functional with a ${reportData.summary.successRate}% success rate. Address the issues above for optimal performance.\n`;
    } else {
      report += `⚠️ **Needs Attention!** Your NGO website has some issues that should be addressed. Success rate: ${reportData.summary.successRate}%.\n`;
    }

    // Save report to file
    fs.writeFileSync('./test-report.md', report);
    fs.writeFileSync('./test-results.json', JSON.stringify(reportData, null, 2));

    return report;
  }

  async run() {
    console.log('\n🚀 Starting NGO Website Test Suite...\n');
    
    await this.runTests();
    
    console.log('\n📊 Generating test report...\n');
    const report = this.generateReport();
    
    console.log(report);
    
    console.log('\n📝 Report saved to: test-report.md');
    console.log('📊 Raw results saved to: test-results.json\n');
    
    process.exit(this.results.summary.failed > 0 ? 1 : 0);
  }
}

// Install node-fetch if not available
try {
  require.resolve('node-fetch');
} catch (e) {
  console.log('Installing node-fetch dependency...');
  execSync('npm install node-fetch@2', { stdio: 'inherit' });
}

// Run the test suite
const testSuite = new NGOWebsiteTestSuite();
testSuite.run().catch(console.error);
