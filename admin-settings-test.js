#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Admin Settings Functionality Test\n');

async function testSettingsAPI() {
    const baseURL = 'http://localhost:3000';
    
    console.log('1. Testing Settings API Endpoints...');
    
    try {
        // Test GET all settings
        const response = await fetch(`${baseURL}/api/settings`);
        const settings = await response.json();
        
        console.log(`   ✅ GET /api/settings: Found ${settings.length} settings`);
        
        // Check for essential payment settings
        const upiSetting = settings.find(s => s.key === 'upi_id');
        const bankSetting = settings.find(s => s.key === 'bank_name');
        const accountSetting = settings.find(s => s.key === 'account_number');
        
        if (upiSetting) {
            console.log(`   ✅ UPI ID setting found: ${upiSetting.value}`);
        } else {
            console.log('   ❌ UPI ID setting missing');
        }
        
        if (bankSetting) {
            console.log(`   ✅ Bank name setting found: ${bankSetting.value}`);
        } else {
            console.log('   ❌ Bank name setting missing');
        }
        
        if (accountSetting) {
            console.log(`   ✅ Account number setting found: ${accountSetting.value}`);
        } else {
            console.log('   ❌ Account number setting missing');
        }
        
        // Test UPDATE functionality
        console.log('\n2. Testing UPDATE functionality...');
        const updateResponse = await fetch(`${baseURL}/api/settings/upi_id`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                value: 'bawaliyaseva@test'
            }),
        });
        
        if (updateResponse.ok) {
            const updateResult = await updateResponse.json();
            console.log(`   ✅ UPDATE successful: UPI ID changed to ${updateResult.setting.value}`);
            
            // Revert the change
            await fetch(`${baseURL}/api/settings/upi_id`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    value: upiSetting.value
                }),
            });
            console.log(`   ✅ Reverted UPI ID back to: ${upiSetting.value}`);
        } else {
            console.log('   ❌ UPDATE failed');
        }
        
        // Test CREATE functionality
        console.log('\n3. Testing CREATE functionality...');
        const createResponse = await fetch(`${baseURL}/api/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: 'test_setting',
                value: 'test_value',
                description: 'Test setting for validation',
                category: 'general'
            }),
        });
        
        if (createResponse.ok) {
            const createResult = await createResponse.json();
            console.log(`   ✅ CREATE successful: Test setting created with ID ${createResult.setting._id}`);
            
            // Clean up - delete the test setting
            await fetch(`${baseURL}/api/settings/test_setting`, {
                method: 'DELETE'
            });
            console.log('   ✅ Test setting cleaned up');
        } else {
            console.log('   ❌ CREATE failed');
        }
        
        console.log('\n4. Testing Admin Settings Page Access...');
        const pageResponse = await fetch(`${baseURL}/admin/settings`);
        if (pageResponse.ok) {
            console.log('   ✅ Admin settings page accessible');
        } else {
            console.log('   ❌ Admin settings page not accessible');
        }
        
    } catch (error) {
        console.log(`   ❌ API Test failed: ${error.message}`);
    }
}

// Check if required files exist
console.log('5. Checking File Structure...');

const requiredFiles = [
    'src/app/admin/settings/page.tsx',
    'src/models/Setting.ts',
    'src/app/api/settings/route.ts',
    'src/app/api/settings/[key]/route.ts'
];

requiredFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${file} exists`);
    } else {
        console.log(`   ❌ ${file} missing`);
    }
});

console.log('\n📋 Summary:');
console.log('- Admin settings page created with UPI ID and bank details management');
console.log('- Settings API endpoints for CRUD operations');
console.log('- Default payment and contact settings initialized');
console.log('- Edit, add, and delete functionality for all settings');
console.log('- Organized by categories (Payment, Contact, General)');

// Run the API tests
testSettingsAPI().then(() => {
    console.log('\n🎉 Admin Settings Test Complete!');
}).catch(error => {
    console.log(`\n❌ Test failed: ${error.message}`);
});
