const shell = require('shelljs');

shell.echo('Building starts...');

if (shell.exec('npm run build').code !== 0) {
  shell.echo('Error: Failed to build');
  shell.exit(1);
}

shell.exec(`echo "<?php header( 'Location: /' ) ;  ?>" > ./dist/index.php`);

shell.exec(`git add .`);
shell.exec(`git commit -m "New build @${Date.now()}"`);

if (shell.exec('git subtree push --prefix dist heroku master').code !== 0) {
  shell.echo('Error: Failed to deploy build folder to heroku');
  shell.exit(1);
}

if (shell.exec('rm -rf ./dist').code !== 0) {
  shell.echo('Error: Failed to remove built folder');
  shell.exit(1);
}

shell.echo('\nHurray!');
