const fs = require('fs').promises;
const path = require('path');
const util = require('util');

/**
 * Formats file size in a human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formats date in a readable format
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
function formatDate(date) {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Gets file icon for HTML files
 * @returns {string} HTML entity or emoji representing the file type
 */
function getFileIcon() {
  return '📄'; // HTML files icon
}

/**
 * Get a description for HTML files
 * @returns {string} Description of the file
 */
function getFileDescription() {
  return 'HTML document with web content';
}

/**
 * Generate HTML index file with only HTML files
 */
async function generateIndex() {
  try {
    // Get directory contents
    const dirContents = await fs.readdir('.');
    
    // Get file stats and filter to only include HTML files
    const filePromises = dirContents
      .filter(item => 
        !item.startsWith('.') && 
        !['node_modules', 'package-lock.json', 'generate-index.js'].includes(item) &&
        (item.toLowerCase().endsWith('.html') || item.toLowerCase().endsWith('.htm'))
      )
      .map(async (item) => {
        try {
          const stats = await fs.stat(item);
          return {
            name: item,
            isDirectory: stats.isDirectory(),
            size: stats.size,
            lastModified: stats.mtime,
            path: item // For the link
          };
        } catch (err) {
          console.error(`Error reading stats for ${item}:`, err);
          return null;
        }
      });
    
    // Resolve all promises
    const files = (await Promise.all(filePromises))
      .filter(file => file !== null) // Remove any failed stats
      .sort((a, b) => a.name.localeCompare(b.name));
    
    // Start building HTML
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Files Index</title>
    <style>
        :root {
            --primary-color: #4a6fa5;
            --secondary-color: #334e68;
            --accent-color: #829ab1;
            --background-color: #f7f9fc;
            --text-color: #334e68;
            --light-gray: #e6e9ef;
            --white: #ffffff;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--background-color);
            padding: 0;
            margin: 0;
        }
        
        header {
            background-color: var(--white);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            text-align: center;
        }
        
        h1 {
            color: var(--primary-color);
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        
        h2 {
            color: var(--secondary-color);
            margin: 1.5rem 0 1rem;
            font-size: 1.8rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .description {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background-color: var(--white);
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .file-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        
        .file-card {
            background-color: var(--white);
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .file-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .file-card h3 {
            color: var(--primary-color);
            margin-bottom: 0.5rem;
            font-size: 1.4rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .file-card p {
            color: var(--text-color);
            margin-bottom: 1rem;
        }
        
        .file-link {
            display: inline-block;
            background-color: var(--primary-color);
            color: var(--white);
            padding: 0.6rem 1.2rem;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s ease;
        }
        
        .file-link:hover {
            background-color: var(--secondary-color);
        }
        
        .file-meta {
            font-size: 0.85rem;
            color: var(--accent-color);
            margin-bottom: 1rem;
            display: block;
        }
        
        footer {
            text-align: center;
            padding: 2rem;
            background-color: var(--white);
            margin-top: 2rem;
            color: var(--accent-color);
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
            
            .container {
                padding: 1rem;
            }
            
            .file-list {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>HTML Files Index</h1>
        <p>A collection of HTML documents</p>
    </header>
    
    <div class="container">
        <section class="description">
            <h2>About This Collection</h2>
            <p>Welcome to the HTML Files Index! This is a collection of HTML documents available in this directory. Browse through the available files below.</p>
        </section>
        
        <h2>HTML Files</h2>
        <div class="file-list">`;
    
    // Add file cards for HTML files only
    for (const file of files) {
      const icon = getFileIcon();
      const desc = getFileDescription();
      const size = formatFileSize(file.size);
      const date = formatDate(file.lastModified);
      
      html += `
            <div class="file-card">
                <h3>${icon} ${file.name}</h3>
                <p>${desc}</p>
                <span class="file-meta">Size: ${size} • Modified: ${date}</span>
                <a href="${file.path}" class="file-link">View File</a>
            </div>`;
    }
    
    // Close HTML
    html += `
        </div>
    </div>
    
    <footer>
        <p>&copy; ${new Date().getFullYear()} HTML Files Index</p>
    </footer>
</body>
</html>`;
    
    // Write to file
    await fs.writeFile('index.html', html);
    console.log('HTML-only index file successfully generated!');
    
  } catch (error) {
    console.error('Error generating index:', error);
    process.exit(1);
  }
}

// Run the function
generateIndex();