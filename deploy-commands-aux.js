require('dotenv').config();
const token = process.env.BOT_TOKEN;
const { clientId, guildId } = require('./config.json');
const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '10' }).setToken(token);

function addCommands(commands_arr) {
	rest.put(Routes.applicationGuildCommands(clientId, guildId), {
		body: commands_arr
	})
		.then(() =>
			console.log('Successfully registered application commands.')
		)
		.catch(console.error);
}

function removeSingleCommand(commandId) {
	rest.delete(Routes.applicationGuildCommands(clientId, guildId, commandId))
		.then(() => console.log('Successfully deleted application command'))
		.catch(console.error);
}

function removeAllCommands() {
	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] }) // empty array
		.then(() =>
			console.log('Successfully deleted all application commands.')
		)
		.catch(console.error);
}

module.exports = { addCommands, removeAllCommands, removeSingleCommand };
