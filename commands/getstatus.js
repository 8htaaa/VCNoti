const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getstatus')
		.setDescription('ステータスを取得')
};