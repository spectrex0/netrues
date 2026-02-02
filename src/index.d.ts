import { Client, Collection } from "discord.js";
declare module "discord.js" {
    interface Client {
        commands: Collection<string, {
            execute(interaction: any): Promise<void>;
        }>;
    }
}
export declare const netrues: Client & {
    commands: Collection<string, any>;
};
export default netrues;
//# sourceMappingURL=index.d.ts.map