require('dotenv').config();
const { channel } = require('diagnostics_channel');
const Discord = require('discord.js');
const { guildId, channelId } = require('./config.json');

intents = new Discord.IntentsBitField([
	Discord.IntentsBitField.Flags.GuildMessages,
	Discord.IntentsBitField.Flags.MessageContent,
	Discord.IntentsBitField.Flags.Guilds
]);

const client = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL'],
	intents: intents
});

const heresyRegex = new RegExp('.*bog.*?|.*isus.*?|.*marij.*?', 'i');

///// handler functions
function readyDiscord() {
	console.log('Discord authenticated');
	return true;
}

async function getHeresyChannel(client, channelId) {
	return await client.channels.fetch(channelId);
}

async function retrieveHeresyStatus() {
	try {
		const heresyChannel = await getHeresyChannel(client, channelId);
		let heresyStatus = (
			await heresyChannel.messages.fetch(heresyChannel.lastMessageId)
		).cleanContent;
		heresyStatus = heresyStatus
			.match(/\nHeresy counter erects to \d+!/g)
			.pop() // get the last occurence
			.match(/\d+/g); // get the number of occurences
		return parseInt(heresyStatus); // return the number of heresies
	} catch (error) {
		return 0; // no heretic messages have yet been logged, congrats!
	}
}

client.on('ready', readyDiscord);
client.on('ready', retrieveHeresyStatus);

client.on('messageCreate', async (message) => {
	let potentialHeresy = message.cleanContent;
	let heresyCounter = await retrieveHeresyStatus();
	if (heresyRegex.test(potentialHeresy) && message.channelId !== channelId) {
		const heresyChannel = await getHeresyChannel(client, channelId);
		await heresyChannel.send(
			`${message.author.username} said: ${
				message.cleanContent
			}.\nHeresy counter erects to ${heresyCounter + 1}!`
		);
	}

	// const { commandName } = interaction;

	// if (commandName === 'unholycount') {
	// 	// get all the channels available
	// 	const GuildChannels = await client.guilds.cache
	// 		.map((guild) => guild.channels)[0]
	// 		.fetch();

	// 	totalAll = 0;
	// 	totalHeresy = 0;
	// 	heresyRegex = new RegExp('.*bog.*?|.*isus.*?|.*marij.*?', 'i');
	// 	for ([channelId, channelData] of GuildChannels) {
	// 		// if we're dealing with a text channel
	// 		if (channelData.name === 'bot-testing' && channelData.type === 0) {
	// 			allMessageMaps = await channelData.messages.fetch({
	// 				limit: 100
	// 			});
	// 			messageObjects = allMessageMaps.values();
	// 			for (let message of messageObjects) {
	// 				if (
	// 					!message.author.bot &&
	// 					heresyRegex.test(message.cleanContent)
	// 				)
	// 					totalHeresy++;
	// 				totalAll++;
	// 			}
	// 		}
	// 	}

	// 	await interaction.reply(
	// 		`In the past 100 messages heresy has been commited ${totalHeresy} times among the ${totalAll} messages sent in general chat which amounts to ${Math.round(
	// 			(totalHeresy / totalAll) * 100,
	// 			2
	// 		)}%.`
	// 	);
	// }
});

client.login(process.env.BOT_TOKEN);
