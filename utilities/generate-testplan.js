#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Test Plan Generator
 * 
 * This utility scans all test specification files recursively,
 * extracts Gherkin documentation from the top of each file,
 * and generates an organized test plan document.
 */

class TestPlanGenerator {
  constructor() {
    this.testDirectory = 'tests';
    this.outputFile = 'test-plan.md';
    this.testFiles = [];
    this.gherkinContent = new Map();
  }

  /**
   * Main entry point to generate the test plan
   */
  async generateTestPlan() {
    console.log('🚀 Starting test plan generation...');
    
    try {
      // Step 1: Recursively find all test spec files
      this.findTestFiles(this.testDirectory);
      console.log(`📁 Found ${this.testFiles.length} test files`);

      // Step 2: Extract Gherkin content from each file
      await this.extractGherkinContent();
      console.log(`📖 Extracted Gherkin from ${this.gherkinContent.size} files`);

      // Step 3: Generate the organized test plan document
      await this.generateTestPlanDocument();
      console.log(`✅ Test plan generated: ${this.outputFile}`);
      
    } catch (error) {
      console.error('❌ Error generating test plan:', error.message);
      process.exit(1);
    }
  }

  /**
   * Recursively find all .spec.js files in the test directory
   * @param {string} directory - Directory to scan
   */
  findTestFiles(directory) {
    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          // Recursively scan subdirectories
          this.findTestFiles(itemPath);
        } else if (stats.isFile() && item.endsWith('.spec.js')) {
          // Add test spec files to our collection
          this.testFiles.push(itemPath);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${directory}:`, error.message);
    }
  }

  /**
   * Extract Gherkin documentation from the top of each test file
   */
  async extractGherkinContent() {
    for (const filePath of this.testFiles) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const gherkin = this.parseGherkinFromFile(fileContent);
        
        if (gherkin) {
          this.gherkinContent.set(filePath, {
            gherkin: gherkin,
            relativePath: filePath,
            directory: path.dirname(filePath),
            filename: path.basename(filePath)
          });
        } else {
          console.warn(`⚠️  No Gherkin documentation found in: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
      }
    }
  }

  /**
   * Parse Gherkin content from file content using regex
   * @param {string} content - File content
   * @returns {string|null} - Extracted Gherkin content or null
   */
  parseGherkinFromFile(content) {
    // Match the JSDoc comment block at the top of the file
    const gherkinRegex = /\/\*\*\s*\n([\s\S]*?)\*\//;
    const match = content.match(gherkinRegex);
    
    if (match && match[1]) {
      // Clean up the comment content
      const gherkinLines = match[1]
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, '').trim()) // Remove comment markers
        .filter(line => line.length > 0) // Remove empty lines
        .join('\n');
      
      // Check if it contains Gherkin keywords
      if (this.containsGherkinKeywords(gherkinLines)) {
        return gherkinLines;
      }
    }
    
    return null;
  }

  /**
   * Check if content contains Gherkin keywords
   * @param {string} content - Content to check
   * @returns {boolean} - True if contains Gherkin keywords
   */
  containsGherkinKeywords(content) {
    const gherkinKeywords = [
      'Feature:', 'Scenario:', 'Scenario Outline:', 'Examples:',
      'Given', 'When', 'Then', 'And', 'But'
    ];
    
    return gherkinKeywords.some(keyword => 
      content.includes(keyword)
    );
  }

  /**
   * Generate the organized test plan document
   */
  async generateTestPlanDocument() {
    const timestamp = new Date().toISOString().split('T')[0];
    let markdown = this.generateHeader(timestamp);
    
    // Group tests by directory structure
    const groupedTests = this.groupTestsByDirectory();
    
    // Generate table of contents
    markdown += this.generateTableOfContents(groupedTests);
    
    // Generate detailed sections for each directory
    markdown += this.generateDetailedSections(groupedTests);
    
    // Write the test plan file
    fs.writeFileSync(this.outputFile, markdown, 'utf8');
  }

  /**
   * Generate the markdown header
   * @param {string} timestamp - Generation timestamp
   * @returns {string} - Header markdown
   */
  generateHeader(timestamp) {
    return `# Test Plan

**Generated:** ${timestamp}  
**Total Test Files:** ${this.gherkinContent.size}

This document provides an organized view of all test scenarios based on Gherkin documentation extracted from test specification files.

---

`;
  }

  /**
   * Group tests by their directory structure
   * @returns {Map} - Tests grouped by directory
   */
  groupTestsByDirectory() {
    const grouped = new Map();
    
    for (const [filePath, testInfo] of this.gherkinContent) {
      const directory = testInfo.directory;
      
      if (!grouped.has(directory)) {
        grouped.set(directory, []);
      }
      
      grouped.get(directory).push(testInfo);
    }
    
    return grouped;
  }

  /**
   * Generate table of contents
   * @param {Map} groupedTests - Tests grouped by directory
   * @returns {string} - Table of contents markdown
   */
  generateTableOfContents(groupedTests) {
    let toc = `## Table of Contents\n\n`;
    
    for (const [directory, tests] of groupedTests) {
      const sectionName = this.formatDirectoryName(directory);
      const anchor = this.createAnchor(sectionName);
      
      toc += `- [${sectionName}](#${anchor})\n`;
      
      for (const test of tests) {
        const testAnchor = this.createAnchor(test.filename);
        toc += `  - [${test.filename}](#${testAnchor})\n`;
      }
    }
    
    toc += `\n---\n\n`;
    return toc;
  }

  /**
   * Generate detailed sections for each directory
   * @param {Map} groupedTests - Tests grouped by directory
   * @returns {string} - Detailed sections markdown
   */
  generateDetailedSections(groupedTests) {
    let sections = `## Test Specifications\n\n`;
    
    for (const [directory, tests] of groupedTests) {
      const sectionName = this.formatDirectoryName(directory);
      sections += `### ${sectionName}\n\n`;
      sections += `**Directory:** \`${directory}\`\n\n`;
      
      for (const test of tests) {
        sections += `#### ${test.filename}\n\n`;
        sections += `**File Path:** \`${test.relativePath}\`\n\n`;
        sections += `\`\`\`gherkin\n${test.gherkin}\n\`\`\`\n\n`;
        sections += `---\n\n`;
      }
    }
    
    return sections;
  }

  /**
   * Format directory name for display
   * @param {string} directory - Directory path
   * @returns {string} - Formatted name
   */
  formatDirectoryName(directory) {
    return directory
      .split('/')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' / ');
  }

  /**
   * Create markdown anchor from text
   * @param {string} text - Text to convert
   * @returns {string} - Anchor string
   */
  createAnchor(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

// Run the test plan generator
const generator = new TestPlanGenerator();
generator.generateTestPlan(); 