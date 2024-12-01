const fs = require('fs');
const path = require('path');

// Get all HTML files in the current directory
const htmlFiles = fs.readdirSync('.')
    .filter(file => file.endsWith('.html') && file !== 'page-template.html');

// Read the template
const template = fs.readFileSync('page-template.html', 'utf8');

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Extract the main content between nav and footer
    const mainContent = content.match(/<main[\s\S]*?<\/main>/i) || 
                       content.match(/<div class="container"[\s\S]*?<\/div>/i) ||
                       ['<!-- Main content here -->'];

    // Get the page title
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(' - The Clarity Club', '') : file.replace('.html', '');

    // Get the CSS filename
    const cssFilename = file.replace('.html', '');

    // Create the new page content
    let newContent = template
        .replace('PAGE_TITLE', title)
        .replace('PAGE_CSS', cssFilename)
        .replace('<!-- PAGE_CONTENT -->', mainContent[0]);

    // Set the active navigation link
    const currentPage = file;
    newContent = newContent.replace(
        `href="${currentPage}"`,
        `href="${currentPage}" class="active"`
    );

    // Write the updated content back to the file
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
});
