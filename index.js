const core = require("@actions/core");
const { Console } = require("console");

function getHomeEnv() {
	if(process.platform === "win32")
	{
		// Windows
		return "USERPROFILE";
	}

	// macOS / Linux
	return "HOME";
}

function getHomeDirectory() {
	const homeEnv = getHomeEnv();
	const home = process.env[homeEnv];
	if(home === undefined)
	{
		throw Error(`${homeEnv} is not defined`);
	}
	return home;
}

async function run() {
  // Read Inputs
  const name = core.getInput("NAME");
  const sshkey = core.getInput("SSH_KEY");
  const repo = core.getInput("REPO");
  var podfile =  core.getInput("PODFILE");

  // Podfile path
  if (!podfile) {
    podfile = "./podfile"
  }

  // Modified repo URL
  const repoModified = repo.replace("github.com", `github-${name}`);
  const fs = require('fs');
  const path = require('path');
  const home = getHomeDirectory();
  const dirName = path.resolve(home, ".ssh");

  // Create directory if it doesn't exist
  fs.mkdirSync(dirName, {
    recursive: true,
    mode: 0o700,
  });

  // Create SSH Key file
  const fileName = path.join(dirName, name)
  const os = require("os");
  fs.writeFile(fileName, sshkey + os.EOL, { 
    encoding: "utf8", 
    flag: "w", 
    mode: 0o666 
  }, (err) => {
    if (err) throw err;
    console.log(`Created ssh key file: ~/.ssh/${name}`)
    fs.chmodSync(fileName, '600');
  });

  // Write config for the SSH Key
  const configFileName = path.join(dirName, 'config')
  const configString = `
    Host github-${name}
      HostName github.com
      IdentityFile ${fileName.toString()}
  `;

  if (fs.existsSync(configFileName)) {
    fs.readFile(configFileName, function (err, data) {
      if (err) throw err;
      if(!(data.indexOf(configString) >= 0)) {
        fs.appendFile(configFileName, configString, function (err) {
          if (err) throw err;
        });
      } else {
        console.log("Config already exists")
      }
    });
  } else {
    fs.appendFile(configFileName, configString, function (err) {
      if (err) throw err;
    });
  }

  // Modify Podfile to use new repo URL
 
  fs.readFile(podfile, 'utf8', function (err,data) {
    if (err) throw err;
    const replacer = new RegExp(repo, 'g')
    var result = data.replace(replacer, repoModified);
    fs.writeFile(podfile, result, 'utf8', function (err) {
      if (err) throw err;
      console.log(`Modified ${repo} to ${repoModified} in podfile`)
    });
  });
}

run();
