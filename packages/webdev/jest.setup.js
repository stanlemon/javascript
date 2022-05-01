require("@testing-library/jest-dom");

const { Crypto } = require("@peculiar/webcrypto");

global.crypto = new Crypto();

if (!window.setImmediate) {
  // This is as gross as it looks. It's a workaround for using PouchDB in tests.
  window.setImmediate = window.setTimeout; // ts: as unknown as typeof setImmediate;
}
