#!/usr/bin/env node

const fetch = require('node-fetch');

class DebugAdminTest {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
  }

  async makeRequest(method, url, data = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }
      
      console.log(`\n🔥 ${method} ${url}`);
      if (data) console.log('📦 Data:', JSON.stringify(data, null, 2));
      
      const response = await fetch(url, options);
      const result = await response.text();
      
      console.log(`📊 Status: ${response.status} ${response.ok ? '✅' : '❌'}`);
      console.log(`📋 Response:`, result);
      
      let parsedResult;
      try {
        parsedResult = JSON.parse(result);
      } catch (e) {
        parsedResult = result;
      }
      
      return {
        status: response.status,
        ok: response.ok,
        data: parsedResult
      };
    } catch (error) {
      console.error(`❌ Request failed:`, error.message);
      return { status: 500, ok: false, data: null };
    }
  }

  async testEventCRUD() {
    console.log('\n🚀 Testing Event CRUD Operations\n');
    
    // Test event data with all required fields
    const eventData = {
      title: 'Debug Test Event',
      description: 'This is a debug test event',
      date: '2025-08-30',
      time: '18:00',
      location: 'Debug Location',
      organizer: 'Debug Organizer'
    };
    
    // CREATE
    const createResult = await this.makeRequest('POST', `${this.baseUrl}/api/events`, eventData);
    
    if (createResult.ok && createResult.data && createResult.data.event) {
      const eventId = createResult.data.event._id;
      console.log(`✅ Event created with ID: ${eventId}`);
      
      // UPDATE
      const updateData = { ...eventData, title: 'Updated Debug Test Event' };
      const updateResult = await this.makeRequest('PUT', `${this.baseUrl}/api/events/${eventId}`, updateData);
      
      if (updateResult.ok) {
        console.log(`✅ Event updated successfully`);
      } else {
        console.log(`❌ Event update failed`);
      }
      
      // DELETE
      const deleteResult = await this.makeRequest('DELETE', `${this.baseUrl}/api/events/${eventId}`);
      
      if (deleteResult.ok) {
        console.log(`✅ Event deleted successfully`);
      } else {
        console.log(`❌ Event deletion failed`);
      }
    } else {
      console.log(`❌ Event creation failed - no ID returned`);
    }
  }

  async testDonationCRUD() {
    console.log('\n🚀 Testing Donation CRUD Operations\n');
    
    // Test donation data with correct field names
    const donationData = {
      donorName: 'Debug Donor',
      email: 'debug@test.com',
      phone: '9876543210',
      amount: 1000,
      purpose: 'Debug Donation',
      paymentMode: 'Cash'
    };
    
    // CREATE
    const createResult = await this.makeRequest('POST', `${this.baseUrl}/api/donations`, donationData);
    
    if (createResult.ok && createResult.data && createResult.data.donation) {
      const donationId = createResult.data.donation._id;
      console.log(`✅ Donation created with ID: ${donationId}`);
      
      // Note: Donations typically don't have UPDATE/DELETE operations for audit reasons
      // But let's check if routes exist
      const updateResult = await this.makeRequest('PUT', `${this.baseUrl}/api/donations/${donationId}`, donationData);
      const deleteResult = await this.makeRequest('DELETE', `${this.baseUrl}/api/donations/${donationId}`);
      
      console.log(`📋 Update support: ${updateResult.status !== 404 ? 'Available' : 'Not Available'}`);
      console.log(`📋 Delete support: ${deleteResult.status !== 404 ? 'Available' : 'Not Available'}`);
    } else {
      console.log(`❌ Donation creation failed`);
    }
  }

  async testGalleryCRUD() {
    console.log('\n🚀 Testing Gallery CRUD Operations\n');
    
    // Test gallery data with correct field names
    const galleryData = {
      title: 'Debug Gallery Item',
      description: 'This is a debug gallery item',
      type: 'photo',
      url: 'https://via.placeholder.com/800x600?text=Debug'
    };
    
    // CREATE
    const createResult = await this.makeRequest('POST', `${this.baseUrl}/api/gallery`, galleryData);
    
    if (createResult.ok && createResult.data && createResult.data.galleryItem) {
      const galleryId = createResult.data.galleryItem._id;
      console.log(`✅ Gallery item created with ID: ${galleryId}`);
      
      // UPDATE
      const updateData = { ...galleryData, title: 'Updated Debug Gallery Item' };
      const updateResult = await this.makeRequest('PUT', `${this.baseUrl}/api/gallery/${galleryId}`, updateData);
      
      if (updateResult.ok) {
        console.log(`✅ Gallery item updated successfully`);
      } else {
        console.log(`❌ Gallery item update failed`);
      }
      
      // DELETE
      const deleteResult = await this.makeRequest('DELETE', `${this.baseUrl}/api/gallery/${galleryId}`);
      
      if (deleteResult.ok) {
        console.log(`✅ Gallery item deleted successfully`);
      } else {
        console.log(`❌ Gallery item deletion failed`);
      }
    } else {
      console.log(`❌ Gallery item creation failed`);
    }
  }

  async runTests() {
    console.log('🔍 Admin CRUD Operations Debug Test\n');
    
    await this.testEventCRUD();
    await this.testDonationCRUD();
    await this.testGalleryCRUD();
    
    console.log('\n🏁 Debug tests completed');
  }
}

// Run the debug tests
const debugTest = new DebugAdminTest();
debugTest.runTests().catch(console.error);
