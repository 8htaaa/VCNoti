const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('customize')
		.setDescription('入退通知をカスタマイズ')
        .addStringOption(option =>
            option.setName('選択')
                .setDescription('どれをカスタマイズしますか？')
                .setRequired(true)
                .addChoices(
                    { name: '通話開始時', value: 'start' },
                    { name: '接続時', value: 'join' },
                    { name: '切断時', value: 'leave' },
                    { name: 'すべてリセット', value: 'reset' },
                ))
};
