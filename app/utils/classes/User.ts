import { User as PrismaUser } from "@prisma/client";
import { db, hash } from "../db.server";
import Signer from "../signer.server";
import UserFlags, { UserFlag } from "./UserFlags";

type JsonUser = {
    flag: number;
    email: string;
    password: string;
    username: string;
    discriminator: string;
    avatar: string;
};

type AuthorizedUser = Omit<JsonUser, "password">;

export class User {

    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    created_at: any;

    flag: UserFlag;

    private _email: string;
    private _password: string;

    constructor(prisma_user: PrismaUser) {

        this.id = prisma_user.id;
        this.username = prisma_user.username;
        this.discriminator = prisma_user.discriminator;
        this.avatar = prisma_user.avatar;
        this.created_at = prisma_user.createdAt;

        this.flag = UserFlags(prisma_user.flag);

        this._email = prisma_user.email;
        this._password = prisma_user.password;

    }

    // Constructors

    public static from_id(id: string): Promise<User> {
        return new Promise((resolve, reject) => {

            db.user.findUnique({
                where: { id }
            }).then(user => {
                if (!user) return reject("No user exists with that ID");
                resolve(new User(user));
            });

        })
    }

    public static from_token(token: string): Promise<User> {

        return new Promise((resolve, reject) => {

            if (!Signer.verify(token)) return reject("Invalid authorization");

            const data = Signer.decode(token);
            if (!data || !data.payload.id) return reject("Invalid authorization");

            User.from_id(data.payload.id)
                .then(resolve)
                .catch(reject);

        });

    }

    public static from_login(email: string, password: string): Promise<User> {

        return new Promise((resolve, reject) => {

            db.user.findUnique({
                where: { email }
            }).then(async user => {

                if (!user) return reject("No user exists with that email");
                if(user.password !== hash(password)) return reject("Invalid password");

                resolve(new User(user));

            });


        });

    }

    // Save function
    async save() {

        // TODO: Perform validation and checks to ensure
        // No duplicate data is being saved / overwritten

        await db.user.update({
            where: {
                id: this.id
            },

            data: this.to_JSON()

        })

    }

    // Internal to-JSON function
    private to_JSON(): JsonUser {

        return {
            flag: this.flag.flag,
            email: this._email,
            password: this._password,
            username: this.username,
            discriminator: this.discriminator,
            avatar: this.avatar
        }

    }

    /**
     * Data to be seen by the user
     * @returns Authorized user data
     */
    public to_authorized(): AuthorizedUser {

        let json: { [key: string]: any } = this.to_JSON();

        // Remove sensitive fields
        delete json.password;

        return json as AuthorizedUser;

    }

    /**
     * Generates a JWT for user authentication
     * @returns JWT
     */
    public generate_token() {
        return Signer.sign(this.to_authorized());
    }

}