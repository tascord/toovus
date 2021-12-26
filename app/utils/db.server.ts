/* Taken from remix docs */
// https://remix.run/docs/en/v1/tutorials/jokes#set-up-prisma

import { PrismaClient } from "@prisma/client";
import { User } from "./classes/User";
import crypto from "crypto";

let db: PrismaClient;

declare global {
    var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
    db = new PrismaClient();
    db.$connect();
} else {
    if (!global.__db) {
        global.__db = new PrismaClient();
        global.__db.$connect();
    }
    db = global.__db;
}

export { db };

/* All mine now bby <3<3 */

export function hash(key: string) {
    return crypto
        .createHash('sha256')
        .update(key)
        .digest('hex');
}

export function register_account(username: string, email: string, password: string) {

    username = username.toLowerCase();

    return new Promise<User>(async (resolve, reject) => {

        // Ensure username fits requirements
        if (username.length < 3) {
            return reject("Username must be at least 3 characters long.");
        }

        if (username.length > 20) {
            return reject("Username must be less than 20 characters long.");
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return reject("Username can only contain letters, numbers and underscores.");
        }

        // Ensure email is valid
        if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            return reject("Email must be valid.");
        }

        // Ensure password fits requirements
        if (password.length < 8) {
            return reject("Password must be at least 8 characters long.");
        }

        if (password.length > 100) {
            return reject("Password must be less than 100 characters long.");
        }

        // Ensure email is not taken
        let existing_user = await db.user.findFirst({
            where: { email: email }
        });

        if (existing_user) {
            return reject("Email is already taken.");
        }

        // Find an avaliable discriminator
        let discriminator: number | string;

        do {
            discriminator = Math.floor(Math.random() * 1000);
            discriminator = (Array(4).fill(null).map((_, i, a) => discriminator.toString().split('').reverse()[a.length - i - 1] ?? 0)).join('');
        } while (
            await db.user.findFirst({
                where: {
                    username: username,
                    discriminator: discriminator
                }
            })
        )

        // Hash password
        let hashed = await hash(password);

        // Create user
        let user = await db.user.create({
            data: {
                username: username,
                email: email,
                password: hashed,
                avatar: 'default',
                discriminator: discriminator,
                profile: {
                    create: {
                    }
                }
            }
        });

        resolve(new User(user));

    });

}