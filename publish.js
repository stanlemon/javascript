import { readFileSync, readdirSync } from "fs";
import { spawnSync } from "child_process";

import path from "path";

function loadJSON(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url)));
}

// Load the root package file so we can iterate over configured workspaces
const data = loadJSON("./package.json");

let workspaces = [];

data.workspaces.forEach((workspace) => {
  // If this is a glob, remove the asterisk
  if (workspace.substring(workspace.length - 1) === "*") {
    workspace = workspace.substring(0, workspace.length - 1);

    // Find every workspace under this glob
    readdirSync(path.resolve(workspace)).forEach((file) => {
      // Skip all dot files
      if (file.substring(0, 1) === ".") {
        return;
      }

      workspaces.push(path.join(workspace, file));
    });
  } else {
    // This is a specific workspace, go ahead and just add it
    workspaces.push(workspace);
  }
});

// Make a unique list of all the workspaces that we found
workspaces = workspaces.filter((v, i, a) => a.indexOf(v) === i);

workspaces.forEach((workspace) => {
  const command = `--workspace=${workspace}`;

  const result = spawnSync("npm", ["publish", "--access=public", command]);

  if (result.status === 0) {
    console.log(`Published ${workspace}`);
  } else {
    console.log(`Skipping ${workspace}`);
  }
});
