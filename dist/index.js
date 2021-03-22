module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 456:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(105);
const { Console } = __nccwpck_require__(82);

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
    podfile = "./Podfile"
  }

  // Modified repo URL
  const repoModified = repo.replace("github.com", `github-${name}`);
  const fs = __nccwpck_require__(747);
  const path = __nccwpck_require__(622);
  const home = getHomeDirectory();
  const dirName = path.resolve(home, ".ssh");

  // Create directory if it doesn't exist
  fs.mkdirSync(dirName, {
    recursive: true,
    mode: 0o700,
  });

  // Create SSH Key file
  const fileName = path.join(dirName, name)
  const os = __nccwpck_require__(87);
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


/***/ }),

/***/ 105:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 82:
/***/ ((module) => {

"use strict";
module.exports = require("console");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(456);
/******/ })()
;