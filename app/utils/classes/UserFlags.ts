
// Note: Flags MUST be added at the bottom of the list
// Failure to do so will result in users getting the wrong flags
const FLAGS = [

    'STAFF',
    'COMMUNITY_MODERATOR',
    'BUG_HUNTER',
    'BIG_BUG_HUNTER',
    'CONTRIBUTOR',
    'DONATOR',

] as const;

export type Flag = typeof FLAGS[number];

const flag_index = (flag: Flag) => {

    let c = 1;
    for (const f of FLAGS) {
        if (f === flag) return c;
        c *= 2;
    }

    throw new Error(`Flag "${flag}" does not exist`);

}

export type UserFlag = {
    
    flag: number,

    has: (flag: Flag) => boolean,
    list: () => Flag[],
    add: (flag: Flag) => void,
    remove: (flag: Flag) => void,

}

export default (bitwise = 0): UserFlag => (
    {

        flag: bitwise,

        has(flag: Flag) {
            return !!(this.flag & flag_index(flag));
        },

        list() {
            return FLAGS.filter(f => this.has(f));
        },

        add(flag: Flag) {
            this.flag = this.flag | flag_index(flag);
        },

        remove(flag: Flag) {
            if (this.has(flag)) {
                this.flag = this.flag ^ flag_index(flag);
            }
        }

    }
)