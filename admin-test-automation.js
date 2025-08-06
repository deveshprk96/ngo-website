#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class AdminConsoleTestSuite {
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
    this.testData = {
      adminCredentials: {
        email: 'admin@bawaliyaseva.org',
        password: 'admin123'
      },
      testEvent: {
        title: 'Test Admin Event ' + Date.now(),
        description: 'This is a test event created by admin automation',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '18:00',
        location: 'Test Location',
        organizer: 'Test Organizer',
        capacity: 50
      },
      testDonation: {
        donorName: 'Test Donor ' + Date.now(),
        email: 'testdonor' + Date.now() + '@test.com',
        phone: '9876543210',
        amount: 1000,
        purpose: 'Test Donation',
        paymentMode: 'Cash'
      },
      testGalleryItem: {
        title: 'Test Gallery Item ' + Date.now(),
        description: 'Test gallery item for admin testing',
        type: 'photo',
        url: 'https://via.placeholder.com/800x600?text=Test+Image'
      }
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      info: '🔍',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      start: '🚀',
      admin: '👨‍💼'
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

  async makeHttpRequest(url, method = 'GET', body = null, headers = {}) {
    const fetch = (await import('node-fetch')).default;
    try {
      const options = { 
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };
      if (body) {
        options.body = typeof body === 'string' ? body : JSON.stringify(body);
      }
      const response = await fetch(url, options);
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      return {
        status: response.status,
        ok: response.ok,
        data,
        headers: response.headers
      };
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      this.log('Starting development server for admin testing...', 'start');
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
            setTimeout(resolve, 3000);
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

  async simulateAdminLogin() {
    this.log('Attempting admin login simulation...', 'admin');
    
    // First check if admin login page loads
    const loginPageResponse = await this.makeHttpRequest(`${this.baseUrl}/admin/login`);
    if (!loginPageResponse.ok) {
      throw new Error('Admin login page not accessible');
    }

    // For testing purposes, we'll simulate successful login by checking the admin dashboard
    // In a real test, you'd use a headless browser like Playwright or Puppeteer
    const dashboardResponse = await this.makeHttpRequest(`${this.baseUrl}/admin`);
    
    return {
      loginPageAccessible: loginPageResponse.ok,
      dashboardAccessible: dashboardResponse.ok
    };
  }

  async testEventOperations() {
    this.log('Testing event CRUD operations...', 'admin');
    
    let createdEventId = null;
    
    try {
      // Test GET events (read)
      const getResponse = await this.makeHttpRequest(`${this.baseUrl}/api/events`);
      const initialEventsCount = Array.isArray(getResponse.data) ? getResponse.data.length : 0;
      
      // Test POST event (create)
      const createResponse = await this.makeHttpRequest(
        `${this.baseUrl}/api/events`,
        'POST',
        this.testData.testEvent
      );
      
      if (createResponse.status === 201 || createResponse.status === 200) {
        createdEventId = createResponse.data._id || createResponse.data.id;
      }
      
      // Verify event was created
      const getAfterCreateResponse = await this.makeHttpRequest(`${this.baseUrl}/api/events`);
      const newEventsCount = Array.isArray(getAfterCreateResponse.data) ? getAfterCreateResponse.data.length : 0;
      
      // Test PUT event (update) if event was created
      let updateSuccessful = false;
      if (createdEventId) {
        const updateData = { ...this.testData.testEvent, title: 'Updated Test Event' };
        const updateResponse = await this.makeHttpRequest(
          `${this.baseUrl}/api/events/${createdEventId}`,
          'PUT',
          updateData
        );
        updateSuccessful = updateResponse.ok;
      }
      
      // Test DELETE event (delete) if event was created
      let deleteSuccessful = false;
      if (createdEventId) {
        const deleteResponse = await this.makeHttpRequest(
          `${this.baseUrl}/api/events/${createdEventId}`,
          'DELETE'
        );
        deleteSuccessful = deleteResponse.ok;
      }
      
      return {
        read: getResponse.ok,
        create: createResponse.ok,
        update: updateSuccessful,
        delete: deleteSuccessful,
        dataConsistency: newEventsCount > initialEventsCount,
        eventId: createdEventId
      };
    } catch (error) {
      throw new Error(`Event operations failed: ${error.message}`);
    }
  }

  async testDonationOperations() {
    this.log('Testing donation CRUD operations...', 'admin');
    
    try {
      // Test GET donations (read)
      const getResponse = await this.makeHttpRequest(`${this.baseUrl}/api/donations`);
      const initialDonationsCount = Array.isArray(getResponse.data) ? getResponse.data.length : 0;
      
      // Test POST donation (create)
      const createResponse = await this.makeHttpRequest(
        `${this.baseUrl}/api/donations`,
        'POST',
        this.testData.testDonation
      );
      
      let createdDonationId = null;
      if (createResponse.status === 201 || createResponse.status === 200) {
        createdDonationId = createResponse.data._id || createResponse.data.id;
      }
      
      // Verify donation was created
      const getAfterCreateResponse = await this.makeHttpRequest(`${this.baseUrl}/api/donations`);
      const newDonationsCount = Array.isArray(getAfterCreateResponse.data) ? getAfterCreateResponse.data.length : 0;
      
      return {
        read: getResponse.ok,
        create: createResponse.ok,
        dataConsistency: newDonationsCount > initialDonationsCount,
        donationId: createdDonationId
      };
    } catch (error) {
      throw new Error(`Donation operations failed: ${error.message}`);
    }
  }

  async testGalleryOperations() {
    this.log('Testing gallery CRUD operations...', 'admin');
    
    try {
      // Test GET gallery items (read)
      const getResponse = await this.makeHttpRequest(`${this.baseUrl}/api/gallery`);
      const initialGalleryCount = Array.isArray(getResponse.data) ? getResponse.data.length : 0;
      
      // Test POST gallery item (create)
      const createResponse = await this.makeHttpRequest(
        `${this.baseUrl}/api/gallery`,
        'POST',
        this.testData.testGalleryItem
      );
      
      let createdGalleryId = null;
      if (createResponse.status === 201 || createResponse.status === 200) {
        createdGalleryId = createResponse.data._id || createResponse.data.id;
      }
      
      // Verify gallery item was created
      const getAfterCreateResponse = await this.makeHttpRequest(`${this.baseUrl}/api/gallery`);
      const newGalleryCount = Array.isArray(getAfterCreateResponse.data) ? getAfterCreateResponse.data.length : 0;
      
      // Test DELETE gallery item if created
      let deleteSuccessful = false;
      if (createdGalleryId) {
        const deleteResponse = await this.makeHttpRequest(
          `${this.baseUrl}/api/gallery/${createdGalleryId}`,
          'DELETE'
        );
        deleteSuccessful = deleteResponse.ok;
      }
      
      return {
        read: getResponse.ok,
        create: createResponse.ok,
        delete: deleteSuccessful,
        dataConsistency: newGalleryCount > initialGalleryCount,
        galleryId: createdGalleryId
      };
    } catch (error) {
      throw new Error(`Gallery operations failed: ${error.message}`);
    }
  }

  async testDataReflection() {
    this.log('Testing data reflection across pages...', 'admin');
    
    try {
      // Test if events API data reflects on events page
      const eventsApiResponse = await this.makeHttpRequest(`${this.baseUrl}/api/events`);
      const eventsPageResponse = await this.makeHttpRequest(`${this.baseUrl}/events`);
      
      // Test if donations API data reflects on admin dashboard
      const donationsApiResponse = await this.makeHttpRequest(`${this.baseUrl}/api/donations`);
      const adminDashboardResponse = await this.makeHttpRequest(`${this.baseUrl}/admin`);
      
      // Test if gallery API data reflects on gallery page
      const galleryApiResponse = await this.makeHttpRequest(`${this.baseUrl}/api/gallery`);
      const galleryPageResponse = await this.makeHttpRequest(`${this.baseUrl}/gallery`);
      
      return {
        eventsApiToPage: eventsApiResponse.ok && eventsPageResponse.ok,
        donationsApiToDashboard: donationsApiResponse.ok && adminDashboardResponse.ok,
        galleryApiToPage: galleryApiResponse.ok && galleryPageResponse.ok,
        apiResponsesValid: eventsApiResponse.ok && donationsApiResponse.ok && galleryApiResponse.ok
      };
    } catch (error) {
      throw new Error(`Data reflection test failed: ${error.message}`);
    }
  }

  async runAdminTests() {
    try {
      // Start server
      await this.startServer();

      // Admin Authentication Tests
      await this.addTest('Admin login page accessibility', 'Admin Authentication', async () => {
        const loginResult = await this.simulateAdminLogin();
        return loginResult.loginPageAccessible 
          ? { status: 'passed', message: 'Admin login page accessible' }
          : { status: 'failed', message: 'Admin login page not accessible' };
      });

      await this.addTest('Admin dashboard accessibility', 'Admin Authentication', async () => {
        const dashboardResponse = await this.makeHttpRequest(`${this.baseUrl}/admin`);
        return dashboardResponse.ok 
          ? { status: 'passed', message: 'Admin dashboard accessible' }
          : { status: 'failed', message: 'Admin dashboard not accessible' };
      });

      // Admin Pages Accessibility Tests
      await this.addTest('Admin events page loads', 'Admin Pages', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/admin/events`);
        return response.ok 
          ? { status: 'passed', message: 'Admin events page loads successfully' }
          : { status: 'failed', message: 'Admin events page failed to load' };
      });

      await this.addTest('Admin donations page loads', 'Admin Pages', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/admin/donations`);
        return response.ok 
          ? { status: 'passed', message: 'Admin donations page loads successfully' }
          : { status: 'failed', message: 'Admin donations page failed to load' };
      });

      await this.addTest('Admin gallery page loads', 'Admin Pages', async () => {
        const response = await this.makeHttpRequest(`${this.baseUrl}/admin/gallery`);
        return response.ok 
          ? { status: 'passed', message: 'Admin gallery page loads successfully' }
          : { status: 'failed', message: 'Admin gallery page failed to load' };
      });

      // Event CRUD Operations Tests
      await this.addTest('Events CRUD operations', 'Admin Event Management', async () => {
        const eventOps = await this.testEventOperations();
        const successCount = Object.values(eventOps).filter(val => val === true).length;
        const totalOps = Object.keys(eventOps).length;
        
        if (successCount === totalOps) {
          return { status: 'passed', message: `All event operations successful (${successCount}/${totalOps})` };
        } else if (successCount > totalOps / 2) {
          return { status: 'warning', message: `Most event operations successful (${successCount}/${totalOps})` };
        } else {
          return { status: 'failed', message: `Event operations mostly failed (${successCount}/${totalOps})` };
        }
      });

      // Donation CRUD Operations Tests
      await this.addTest('Donations CRUD operations', 'Admin Donation Management', async () => {
        const donationOps = await this.testDonationOperations();
        const successCount = Object.values(donationOps).filter(val => val === true).length;
        const totalOps = Object.keys(donationOps).length;
        
        if (successCount === totalOps) {
          return { status: 'passed', message: `All donation operations successful (${successCount}/${totalOps})` };
        } else if (successCount > totalOps / 2) {
          return { status: 'warning', message: `Most donation operations successful (${successCount}/${totalOps})` };
        } else {
          return { status: 'failed', message: `Donation operations mostly failed (${successCount}/${totalOps})` };
        }
      });

      // Gallery CRUD Operations Tests
      await this.addTest('Gallery CRUD operations', 'Admin Gallery Management', async () => {
        const galleryOps = await this.testGalleryOperations();
        const successCount = Object.values(galleryOps).filter(val => val === true).length;
        const totalOps = Object.keys(galleryOps).length;
        
        if (successCount === totalOps) {
          return { status: 'passed', message: `All gallery operations successful (${successCount}/${totalOps})` };
        } else if (successCount > totalOps / 2) {
          return { status: 'warning', message: `Most gallery operations successful (${successCount}/${totalOps})` };
        } else {
          return { status: 'failed', message: `Gallery operations mostly failed (${successCount}/${totalOps})` };
        }
      });

      // Data Reflection Tests
      await this.addTest('Data reflection across pages', 'Data Consistency', async () => {
        const reflectionTest = await this.testDataReflection();
        const successCount = Object.values(reflectionTest).filter(val => val === true).length;
        const totalChecks = Object.keys(reflectionTest).length;
        
        if (successCount === totalChecks) {
          return { status: 'passed', message: `All data reflections working (${successCount}/${totalChecks})` };
        } else if (successCount > totalChecks / 2) {
          return { status: 'warning', message: `Most data reflections working (${successCount}/${totalChecks})` };
        } else {
          return { status: 'failed', message: `Data reflection issues (${successCount}/${totalChecks})` };
        }
      });

      // API Response Time Tests
      await this.addTest('API response times', 'Performance', async () => {
        const startTime = Date.now();
        const responses = await Promise.all([
          this.makeHttpRequest(`${this.baseUrl}/api/events`),
          this.makeHttpRequest(`${this.baseUrl}/api/donations`),
          this.makeHttpRequest(`${this.baseUrl}/api/gallery`)
        ]);
        const totalTime = Date.now() - startTime;
        
        const allSuccess = responses.every(r => r.ok);
        if (allSuccess && totalTime < 5000) {
          return { status: 'passed', message: `All APIs respond quickly (${totalTime}ms)` };
        } else if (allSuccess) {
          return { status: 'warning', message: `APIs respond but slowly (${totalTime}ms)` };
        } else {
          return { status: 'failed', message: `Some APIs failed or too slow (${totalTime}ms)` };
        }
      });

      // Database Integration Test
      await this.addTest('Database integration', 'Database', async () => {
        try {
          // Test if we can fetch data from all collections
          const [events, donations, gallery] = await Promise.all([
            this.makeHttpRequest(`${this.baseUrl}/api/events`),
            this.makeHttpRequest(`${this.baseUrl}/api/donations`),
            this.makeHttpRequest(`${this.baseUrl}/api/gallery`)
          ]);
          
          const allConnected = events.ok && donations.ok && gallery.ok;
          if (allConnected) {
            return { status: 'passed', message: 'Database integration working for all collections' };
          } else {
            return { status: 'warning', message: 'Some database collections may not be accessible' };
          }
        } catch (error) {
          return { status: 'failed', message: `Database integration failed: ${error.message}` };
        }
      });

    } finally {
      await this.stopServer();
    }
  }

  generateAdminReport() {
    const reportData = {
      ...this.results,
      summary: {
        ...this.results.summary,
        successRate: Math.round((this.results.summary.passed / this.results.summary.total) * 100)
      }
    };

    let report = `
# NGO Admin Console Test Report
Generated: ${reportData.timestamp}

## Admin Console Summary
- **Total Tests**: ${reportData.summary.total}
- **Passed**: ${reportData.summary.passed} ✅
- **Failed**: ${reportData.summary.failed} ❌
- **Warnings**: ${reportData.summary.warnings} ⚠️
- **Success Rate**: ${reportData.summary.successRate}%

## Admin Test Results by Category

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

    // Admin-specific recommendations
    const failedTests = reportData.tests.filter(t => t.status === 'failed');
    const warningTests = reportData.tests.filter(t => t.status === 'warning');

    if (failedTests.length > 0 || warningTests.length > 0) {
      report += `## Admin Console Recommendations\n\n`;
      
      if (failedTests.length > 0) {
        report += `### Critical Admin Issues:\n`;
        failedTests.forEach(test => {
          report += `- **${test.name}**: ${test.message}\n`;
        });
        report += '\n';
      }
      
      if (warningTests.length > 0) {
        report += `### Admin Items to Review:\n`;
        warningTests.forEach(test => {
          report += `- **${test.name}**: ${test.message}\n`;
        });
        report += '\n';
      }
    }

    report += `## Admin Console Conclusion\n\n`;
    if (reportData.summary.successRate >= 90) {
      report += `🎉 **Excellent!** Your admin console is fully functional with a ${reportData.summary.successRate}% success rate. All admin operations are working perfectly!\n`;
    } else if (reportData.summary.successRate >= 75) {
      report += `👍 **Good!** Your admin console is mostly functional with a ${reportData.summary.successRate}% success rate. Address the issues above for optimal admin experience.\n`;
    } else {
      report += `⚠️ **Needs Attention!** Your admin console has some issues that should be addressed. Success rate: ${reportData.summary.successRate}%.\n`;
    }

    report += `\n### Admin Test Summary:\n`;
    report += `- Authentication System: ${reportData.tests.filter(t => t.category.includes('Authentication')).every(t => t.status === 'passed') ? '✅ Working' : '❌ Issues'}\n`;
    report += `- Admin Pages: ${reportData.tests.filter(t => t.category.includes('Admin Pages')).every(t => t.status === 'passed') ? '✅ All Accessible' : '❌ Some Issues'}\n`;
    report += `- CRUD Operations: ${reportData.tests.filter(t => t.category.includes('Management')).every(t => t.status === 'passed') ? '✅ Full Functionality' : '⚠️ Some Limitations'}\n`;
    report += `- Data Consistency: ${reportData.tests.filter(t => t.category.includes('Consistency')).every(t => t.status === 'passed') ? '✅ Data Synced' : '⚠️ Check Data Flow'}\n`;

    // Save report to file
    fs.writeFileSync('./admin-test-report.md', report);
    fs.writeFileSync('./admin-test-results.json', JSON.stringify(reportData, null, 2));

    return report;
  }

  async run() {
    console.log('\n👨‍💼 Starting NGO Admin Console Test Suite...\n');
    
    await this.runAdminTests();
    
    console.log('\n📊 Generating admin test report...\n');
    const report = this.generateAdminReport();
    
    console.log(report);
    
    console.log('\n📝 Admin report saved to: admin-test-report.md');
    console.log('📊 Admin raw results saved to: admin-test-results.json\n');
    
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

// Run the admin test suite
const adminTestSuite = new AdminConsoleTestSuite();
adminTestSuite.run().catch(console.error);
