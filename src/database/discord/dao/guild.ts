require("dotenv").config();

const discordBotToken = process.env.DISCORD_BOT_SECRET;
const discordBaseURL = process.env.DISCORD_BASE_URL;
const discordGuildId = process.env.DISCORD_GUILD_ID;

export async function memberSearch(gt: any, limit: any) {
	var reqHeader = new Headers();
	reqHeader.append("Content-Type", "application/json");
	reqHeader.append("Authorization", `Bot ${discordBotToken}`);
	const response = await fetch(
		`${discordBaseURL}/guilds/${discordGuildId}/members/search?query=${gt}&limit=${limit}`,
		{
			headers: reqHeader,
		}
	);
	const result = await response.json();
    console.log(result);
	return result;
}
