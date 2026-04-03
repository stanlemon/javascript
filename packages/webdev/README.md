# Webdev

[![npm version](https://badge.fury.io/js/%40stanlemon%2Fwebdev.svg)](https://badge.fury.io/js/%40stanlemon%2Fwebdev)

This repository contains all of my usual environment setup for babel, webpack and jest for developing React apps. I got tired of copying and pasting the same config files everywhere, so I put this together.

To get started, create these files:

package.json
```json
{
  "type": "module",
  "scripts": {
    "start": "webpack serve",
    "build": "NODE_ENV=production webpack",
    "test": "jest",
    "lint": "biome check .",
    "lint:fix": "biome check --write ."
  },
  "devDependencies": {
    "@biomejs/biome": "^2.4.10",
    "@stanlemon/webdev": "*"
  }
}
```

webpack.config.js
```javascript
export { default } from "@stanlemon/webdev/webpack.config.js";
```

jest.config.js
```javascript
export { default } from "@stanlemon/webdev/jest.config.js";
```

biome.json
```json
{
  "files": {
    "includes": [
      "**",
      "!**/dist",
      "!**/node_modules",
      "!**/.git"
    ]
  },
  "assist": {
    "enabled": false
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2
  },
  "javascript": {
    "formatter": {
      "trailingCommas": "es5"
    },
    "jsxRuntime": "transparent"
  },
  "linter": {
    "domains": {
      "react": "recommended",
      "test": "recommended"
    },
    "rules": {
      "complexity": {
        "useOptionalChain": "off"
      },
      "correctness": {
        "noUnusedVariables": "warn"
      },
      "style": {
        "useNodejsImportProtocol": "off"
      },
      "suspicious": {
        "noConsole": {
          "level": "warn",
          "options": {
            "allow": [
              "warn",
              "error"
            ]
          }
        },
        "noDoubleEquals": {
          "level": "error",
          "options": {
            "ignoreNull": false
          }
        }
      }
    }
  }
}
```

Then run `npm install` and start coding!

If you need the old full-stack starter app, use the historical snapshot at [deprecate-2026-03-app-template-hello-world-servers](https://github.com/stanlemon/javascript/tree/deprecate-2026-03-app-template-hello-world-servers/apps/template).

_Eventually I'll add some CLI tooling to streamline this further._
