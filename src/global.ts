export class Global {

    public static isVerbose(): boolean {
        return Global.instance.debug;
    }

    public static enableVerboseMode(): void {
        Global.instance.debug = true;
    }

    private static instance: Global = new Global();

    private constructor(private debug = false) {
    }
}
