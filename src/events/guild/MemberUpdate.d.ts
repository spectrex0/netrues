import { Events, GuildMember } from "discord.js";
export declare const name = Events.GuildMemberUpdate;
export declare const once = false;
export declare function execute(oldMember: GuildMember, newMember: GuildMember): Promise<void>;
//# sourceMappingURL=MemberUpdate.d.ts.map