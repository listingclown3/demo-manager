const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5650; // UPDATED: Using your specified port

// UPDATED: The directory to scan for projects is the current one
// __dirname will resolve to /home/ubuntu/blog-live when you run the script from there
const projectsDirectory = __dirname;

// --- Dynamic Route Creation ---
try {
    const projectFolders = fs.readdirSync(projectsDirectory, { withFileTypes: true })
        .filter(dirent => {
            // We only want directories, and we should ignore hidden ones and node_modules
            return dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'node_modules';
        })
        .map(dirent => dirent.name);

    console.log('Found project folders:', projectFolders.join(', '));

    // Loop through each folder and create a route based on its name
    projectFolders.forEach(projectName => {
        const projectPath = path.join(projectsDirectory, projectName);

        // This will create a route like /aimbow-threejs
        app.use('/' + projectName, express.static(projectPath));

        console.log(`Successfully created route: /${projectName}`);
    });

} catch (error) {
    console.error(`Could not read projects directory at ${projectsDirectory}.`, error);
}

// --- Dynamic Homepage Route ---
app.get('/', (req, res) => {
    const projectFolders = fs.readdirSync(projectsDirectory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'node_modules')
        .map(dirent => dirent.name);

    const projectLinks = projectFolders.map(name => `<li><a href="/<span class="math-inline">\{name\}"\></span>{name}</a></li>`).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head><title>Project Hub</title>
        <style>
            body { font-family: sans-serif; background-color: #2c2f33; color: white; display: flex; justify-content: center; padding-top: 50px; }
            .container { width: 80%; max-width: 600px; }
            a { color: #7289da; font-size: 1.2em; text-decoration: none; }
            li { margin: 10px 0; }
        </style>
        </head>
        <body>
            <div class="container"><h1>Projects</h1><ul>${projectLinks}</ul></div>
        </body></html>
    `);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Node.js Project Router is running on port ${PORT}`);
});
