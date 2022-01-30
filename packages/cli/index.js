#!/usr/bin/env node

import yargs from "yargs";
import process from "process";
import path from "path";
import fs from "fs";
import { getInstalledPathSync } from "get-installed-path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line no-unused-expressions
yargs(process.argv.slice(2))
  .scriptName("lemon")
  .usage("$0 <cmd> [args]")
  .command(
    "create [name]",
    "Create a new app based upon apps/template",
    (yargs) => {
      yargs
        .positional("name", {
          type: "string",
          describe: "Name of the new app.",
        })
        .demandOption("name");
    },
    ({ name }) => {
      let src;
      try {
        // For standard setups where you install the CLI
        src = getInstalledPathSync("@stanlemon/app-template", {
          local: true,
        });
      } catch (err) {
        // Most likely for npx use cases (like in the README)
        src = path.resolve(__dirname, "./../app-template/");
      }
      const dest = path.join(process.cwd(), name);

      console.log(`Creating app:`);
      console.log(`  from = ${src}`);
      console.log(`  to = ${dest}`);
      console.log(``);

      fs.cp(
        src,
        dest,
        {
          dereference: true,
          force: true,
          preserveTimestamps: true,
          recursive: true,
        },
        (e) => {
          console.log("All done!");
        }
      );
    }
  )
  .help().argv;
