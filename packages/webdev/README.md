# Webdev

[![npm version](https://badge.fury.io/js/%40stanlemon%2Fwebdev.svg)](https://badge.fury.io/js/%40stanlemon%2Fwebdev)

This repository contains all of my usual environment setup for babel, webpack and jest for developing React apps. I got tired of copying and pasting the same config files everywhere, so I put this together.

To get started, either copy [apps/template](../../apps/template/) or create these files:

package.json
```json
{
  "type": "module",
  "scripts": {
    "start": "webpack serve",
    "build": "NODE_ENV=production webpack",
    "test": "jest",
    "lint": "eslint --ext js,jsx,ts,tsx ./src/",
    "lint:fix": "eslint --fix --ext js,jsx,ts,tsx ./src/"
  },
  "dependencies": {
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

.eslintrc.json
```json
{
  "extends": [
    "@stanlemon"
  ]
}
```

Then run `npm install` and start coding!

_Eventually I'll add some CLI tooling to streamline this further._
