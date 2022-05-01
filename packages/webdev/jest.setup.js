require("@testing-library/jest-dom");

const { Crypto } = require("@peculiar/webcrypto");

global.crypto = new Crypto();
