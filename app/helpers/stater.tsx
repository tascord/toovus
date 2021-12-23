class Stater<T> {

    private handlers: { [event in keyof T]?: ((args?: T[event]) => void)[] } = {};

    public on<K extends keyof T>(event: K, handler: (args?: T[K]) => void): void {

        if (!this.handlers[event])
            this.handlers[event] = [];

        this.handlers[event]?.push(handler);

    }

    public off<K extends keyof T>(event: K, handler: (args: T[K] | undefined) => void): void {


        if (!this.handlers[event])
            return;

        const index = this.handlers[event]?.indexOf(handler);
        if (!index)
            return;

        this.handlers[event]?.splice(index, 1);


    }

    public emit<K extends keyof T>(event: K, args: T[K] | undefined): void {

        if (!this.handlers[event])
            return;

        this.handlers[event]?.forEach(handler => handler(args));

    }

}

const stater = new Stater<{
    'nav.set_active': string;
}>();

export { stater as Stater };