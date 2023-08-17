require("dotenv").config();
import axios from "axios";

const discordBotToken = process.env.DISCORD_BOT_SECRET;
const discordBaseURL = process.env.DISCORD_BASE_URL;
const discordGuildId = process.env.DISCORD_GUILD_ID;
const discordChannelId = process.env.DISCORD_TOTW_CHANNEL_ID;

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
	// console.log(result);
	return result;
}

export async function getMembersByRoleId(roleId: any) {
	var reqHeader = new Headers();
	reqHeader.append("Content-Type", "application/json");
	reqHeader.append("Authorization", `Bot ${discordBotToken}`);
	const response = await fetch(
		`${discordBaseURL}/guilds/${discordGuildId}/members?limit=1000`,
		{
			headers: reqHeader,
		}
	);
	const result = await response.json();
	console.log(result);
	const membersInRole = result.filter((item: any) => {
		return item.roles.includes(roleId)
	})
	return membersInRole;
}

export async function teamSearch() {
	var reqHeader = new Headers();
	reqHeader.append("Content-Type", "application/json");
	reqHeader.append("Authorization", `Bot ${discordBotToken}`);
	const response = await fetch(
		`${discordBaseURL}/guilds/${discordGuildId}/roles`,
		{
			headers: reqHeader,
		}
	);
	const result = await response.json();
	return result;
}

export async function postOnTotw(image: any) {
	try {
		const payload_json = {
			content: "Here is your current Team of the week - ",
			embeds: [
				{
					title: "Hello, Totw!",
					description: "A job well done indeed.",
					image: {
						url: `attachment://${image.originalname}`,
					},
				},
			],
			attachments: [
				{
					id: 0,
					description: "TOTW",
					filename: image.originalname,
				},
			],
		};
		const formData = new FormData();
		formData.append(
			"payload_json",
			JSON.stringify(payload_json)
		);
		formData.append(
			"files[0]",
			new Blob([image.buffer], {
				type: image.mimetype,
			}),
			image.originalname
		);
		const reqHeader = new Headers();
		reqHeader.append("Content-Type", "multipart/form-data");
		reqHeader.append("Authorization", `Bot ${discordBotToken}`);

		const { data } = await axios.post(
			`${discordBaseURL}/channels/${discordChannelId}/messages`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					"Authorization": `Bot ${discordBotToken}`
				},
			}
		);
		return data;
	} catch (ex:any) {
		throw ex;
	}
}
