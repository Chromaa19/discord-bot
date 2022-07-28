const { SlashCommandBuilder } = require('discord.js');
const {
	removeAllCommands,
	removeSingleCommand,
	addCommands
} = require('./deploy-commands-aux.js');

const commands = [
	new SlashCommandBuilder()
		.setName('unholycount')
		.setDescription(
			'Returns the quantity of holy names abused in an unholy manner.'
		)
].map((command) => command.toJSON());

// addCommands(commands);
removeAllCommands();
// let commandId = 'kopiraj command id iz server settingsa'
// removeSingleCommand('1002017682696196176');
