import * as crypto from "crypto";
const fs = require("fs");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  // The standard secure default length for RSA keys is 2048 bits
  modulusLength: 2048,
});

// *********************************************************************
//
// To export the public key and write it to file:

const exportedPublicKeyBuffer = publicKey.export({
  type: "pkcs1",
  format: "pem",
});
fs.writeFileSync("public.key", exportedPublicKeyBuffer, { encoding: "utf-8" });
// *********************************************************************

// *********************************************************************
//
// To export the private key and write it to file

const exportedPrivateKeyBuffer = privateKey.export({
  type: "pkcs1",
  format: "pem",
});
fs.writeFileSync("private.key", exportedPrivateKeyBuffer, {
  encoding: "utf-8",
});

// *********************************************************************
