import JWT from "jsonwebtoken";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join as pathJoin } from "path";
import { generateKeyPairSync } from "crypto";

if (!existsSync(pathJoin(__dirname, "../keys/private.key"))) {

    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
        }
    });

    writeFileSync(pathJoin(__dirname, "../keys/private.key"), privateKey);
    writeFileSync(pathJoin(__dirname, "../keys/public.key"), publicKey);

}

const keys = {
    privateKey: readFileSync(pathJoin(__dirname, "../keys/private.key")),
    publicKey: readFileSync(pathJoin(__dirname, "../keys/public.key"))
}

/** ------------------------------- **/

export default {

    /**
     * Signs the given payload
     * @param payload Data to sign
     * @param options JWT options
     * @returns Signed data
     */
    sign: function (payload: { [key: string]: any }, options: { [key: string]: any } = {}) {
        return JWT.sign(payload, keys.privateKey, {
            algorithm: "RS256",
            ...options
        })
    },

    /**
     * Verifies a given JWT
     * @param token JWT to verify
     * @returns Decoded JWT
     */
    verify: function (token: string) {
        let data = {};
        try {
            data = JWT.verify(token, keys.publicKey, {
                algorithms: ["RS256"]
            });
        } catch {}

        return data;
    },

    /**
     * Decodes a given JWT
     * @param token JWT to decode
     * @returns Decoded data
     */
    decode: function (token: string) {
        return JWT.decode(token, { complete: true });
    }

}