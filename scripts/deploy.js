const shell = require('shelljs');

shell.echo('Building starts...');

if (shell.exec('npm run build:github').code !== 0) {
  shell.echo('Error: Failed to build');
  shell.exit(1);
}

if (shell.exec('git subtree push --prefix dist origin gh-pages').code !== 0) {
  shell.echo('Error: Failed to deploy build folder to heroku');
  shell.exit(1);
}

if (shell.exec('rm -rf ./dist').code !== 0) {
  shell.echo('Error: Failed to remove built folder');
  shell.exit(1);
}

shell.echo('\nHurray!');
