const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setch')
		.setDescription('vc入退通知を送信するチャンネルを設定')
};