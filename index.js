const { Client ,GatewayIntentBits, Events,ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, embedLength, VoiceChannel, VoiceState, ChannelFlagsBitField,StringSelectMenuBuilder,AttachmentBuilder} = require('discord.js')
const Keyv = require('keyv');
const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
        // ...
    ]
})
const vcch = new Keyv('sqlite://db.sqlite',{ table: 'vcch' })
const settings = new Keyv('sqlite://db.sqlite',{ table: 'settings' })
const jointext = new Keyv('sqlite://db.sqlite',{ table: 'jointext' })
const leavetext = new Keyv('sqlite://db.sqlite',{ table: 'leavetext' })
const starttext = new Keyv('sqlite://db.sqlite',{ table: 'starttext' })
const sumdata = new Keyv('sqlite://db.sqlite',{ table: 'sumdata' })
const achievement = new Keyv('sqlite://db.sqlite',{ table: 'achievement' })

const log = new Keyv('sqlite://db.sqlite',{ table: 'log' })


const { token } = require('./config.json');
client.on('ready', () => {
  console.log(`${client.user.tag}がサーバーにログインしました！`);

  client.user.setActivity(`稼働中│やっほー！！`)
});
	
vcch.on('error', err => console.error('Keyv connection error:', err))


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'getstatus') {
    const modal = new ModalBuilder()
			    .setCustomId('getstatus')
			    .setTitle('データを読み込む');
        const  ServerID = new TextInputBuilder()
			    .setCustomId('ServerID')
			    .setLabel("サーバーID")
			    .setRequired(true)
          .setStyle(TextInputStyle.Short);
        const  UserID = new TextInputBuilder()
			    .setCustomId('UserID')
			    .setLabel("ユーザーID(自分の場合空白)")
			    .setRequired(false)
          .setStyle(TextInputStyle.Short);
		    const firstActionRow = new ActionRowBuilder().addComponents(ServerID);
        const secondActionRow = new ActionRowBuilder().addComponents(UserID);
		    modal.addComponents(firstActionRow,secondActionRow);
		    await interaction.showModal(modal);
  }
  if (interaction.commandName === 'customize') {
    const category = await interaction.options.getString('選択');
    if (category === 'join') {
        const modal = new ModalBuilder()
			    .setCustomId('customize-j')
			    .setTitle('VC接続時の通知をカスタマイズ');
        const jointext = new TextInputBuilder()
			    .setCustomId('join')
			    .setLabel("「@]で名前を入れることができます(例：@が接続しました)")
			    .setStyle(TextInputStyle.Paragraph);
		    const firstActionRow = new ActionRowBuilder().addComponents(jointext);
		    modal.addComponents(firstActionRow);
		    await interaction.showModal(modal);
    } 
    if (category === 'leave') {
      const modal = new ModalBuilder()
        .setCustomId('customize-l')
        .setTitle('VC切断時の通知をカスタマイズ');
      const leavetext = new TextInputBuilder()
        .setCustomId('leave')
        .setLabel("「@]で名前を入れることができます(例：@が切断しました)")
        .setStyle(TextInputStyle.Paragraph);
      const firstActionRow = new ActionRowBuilder().addComponents(leavetext);
      modal.addComponents(firstActionRow);
      await interaction.showModal(modal);
  } 
  if (category === 'start') {
    const modal = new ModalBuilder()
      .setCustomId('customize-s')
      .setTitle('通話開始時の通知をカスタマイズ');
    const starttext = new TextInputBuilder()
      .setCustomId('start')
      .setLabel("「@]で名前を入れることができます(例：@が通話を開始しました)")
      .setStyle(TextInputStyle.Paragraph);
    const firstActionRow = new ActionRowBuilder().addComponents(starttext);
    modal.addComponents(firstActionRow);
    await interaction.showModal(modal);
} 
  if (category === 'reset') {
    await jointext.delete(interaction.guild.id);
    await leavetext.delete(interaction.guild.id);
    await starttext.delete(interaction.guild.id);
    const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('通知のカスタマイズをリセットしました')
      interaction.reply({embeds: [embed]});

  }
  }


  if (interaction.commandName === 'settings') {
    const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('settings')
					.setPlaceholder('選択してください')
					.addOptions(
						{
							label: '通知設定1',
							description: '通話開始時のみ通知する',
							value: '1',
						},
						{
							label: '通知設定2',
							description: '通話開始時と入退を通知する',
							value: '2',
						},
					),
			);

		await interaction.reply({ content: '設定', components: [row] , ephemeral: true});
  }


  if (interaction.commandName === 'setch') {
    await vcch.set(interaction.guild.id , interaction.channel.id);

    const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('チャンネルを設定しました')
            .setDescription('vc入退通知はこのチャンネルに表示されます');
      interaction.reply({embeds: [embed]});
  }
  
  if (interaction.commandName === 'status') {
    try{
    const sum = await sumdata.get(`${interaction.guild.id} and ${interaction.member.id}` )
    let achievementCount = await achievement.get(`${interaction.guild.id} and ${interaction.member.id}` )
    if(achievementCount == undefined){
      var displayachievementCount = 0
    }else{
      var displayachievementCount = achievementCount
    }
    var displayHour = Math.floor(sum/60)
    var displayMin = sum % 60
    if(isNaN(displayHour)){
      var displayTime =`データがありません`
    }
    else if(displayHour == "0"){
      var displayTime =`${displayMin} 分`
    }else{
      var displayTime = `${displayHour} 時間 ${displayMin}分`
    }
          const burl = (`https://8htar-pf.studio.site/VCNoti/achievement-center/${displayachievementCount}?username=${interaction.member.displayName}&servername=${interaction.guild.name}`)
          const url = burl.replace(" ","")
          const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL()})
            .setThumbnail(interaction.member.displayAvatarURL())
            .setColor('Yellow')
            .setTitle(`${interaction.member.displayName}のステータス`)
            .setDescription(`通算通話時間：${displayTime} \n アチーブメント：${displayachievementCount} 個 `)
            .setFooter({ text: 'STATUS'})
            const btn = new ActionRowBuilder()
			      .addComponents(
              new ButtonBuilder()
                .setLabel('アチーブメントセンター')
                .setURL(url)
                .setStyle(ButtonStyle.Link)
            )
        await interaction.reply({embeds: [embed], components: [btn]});
    }catch{
      console.log("err-st")
    }
  }
  if (interaction.commandName === 'ありがとう！！') {
    const embed = new EmbedBuilder()
    .setColor('Yellow')
    .setTitle(`bot使ってくれてありがとうございました！！！`)
    .setDescription(`またどこかで🫶`)
  interaction.reply({embeds: [embed]});
  }
  if (interaction.commandName === 'ステータス') {
    try{
    const { member } = interaction.targetMember
	  const sum = await sumdata.get(`${interaction.guild.id} and ${interaction.targetMember.id}` )
    let achievementCount = await achievement.get(`${interaction.guild.id} and ${interaction.targetMember.id}` )
    if(achievementCount == undefined){
      var displayachievementCount = 0
    }else{
      var displayachievementCount = achievementCount
    }
    var displayHour = Math.floor(sum/60)
    var displayMin = sum % 60
    if(isNaN(displayHour)){
      var displayTime =`データがありません`
    }
    else if(displayHour == "0"){
      var displayTime =`${displayMin} 分`
    }else{
      var displayTime = `${displayHour} 時間 ${displayMin}分`
    }
          const burl = (`https://8htar-pf.studio.site/VCNoti/achievement-center/${displayachievementCount}?username=${interaction.targetMember.displayName}&servername=${interaction.guild.name}`)
          const url = burl.replace(" ","")
          const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.targetMember.displayName, iconURL: interaction.targetMember.displayAvatarURL()})
            .setThumbnail(interaction.targetMember.displayAvatarURL())
            .setColor('Yellow')
            .setTitle(`${interaction.targetMember.displayName}のステータス`)
            .setDescription(`通算通話時間：${displayTime} \n アチーブメント：${displayachievementCount} 個 `)
            .setFooter({ text: 'STATUS'})
            const btn = new ActionRowBuilder()
			      .addComponents(
              new ButtonBuilder()
                .setLabel('アチーブメントセンター')
                .setURL(url)
                .setStyle(ButtonStyle.Link)
            )
        await interaction.reply({embeds: [embed], components: [btn]});
      }catch{
        console.log("err-st")
      }
  }
});



client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === 'getstatus') {
    try{
    var ServerID = interaction.fields.getTextInputValue('ServerID');
    var UserID = interaction.fields.getTextInputValue('UserID');
    if( UserID === "" ){
      var UserID = interaction.user.id
    }
    const sum = await sumdata.get(`${ServerID} and ${UserID}` )
    if(sum == undefined){
      const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(`データが見つかりませんでした`)
      .setDescription(`指定したサーバーでの通話記録が無いか、サーバーIDまたはユーザーIDが違う可能性があります`)
      .setFooter({ text: 'undefined'})
      interaction.reply({embeds: [embed], ephemeral: true });
    }else{
      var displayHour = Math.floor(sum/60)
      var displayMin = sum % 60
      if(isNaN(displayHour)){
        var displayTime =`データがありません`
      }
      else if(displayHour == "0"){
        var displayTime =`${displayMin} 分`
      }else{
        var displayTime = `${displayHour} 時間 ${displayMin}分`
      }
      let thanos = client.users.fetch(UserID);
      thanos.then(function(result) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: result.username, iconURL: result.displayAvatarURL()})
            .setThumbnail(result.displayAvatarURL())
            .setColor('Yellow')
            .setTitle(`${ServerID}での\n${result.username}のステータス`)
            .setDescription(`通算通話時間：${displayTime} `)
            .setFooter({ text: 'STATUS'})
        interaction.reply({embeds: [embed]});
      });
    }
  }catch{
    console.log("errnew")
  }
  }
  if (interaction.customId === 'customize-j') {
  const text = interaction.fields.getTextInputValue('join');
    await jointext.set(interaction.guild.id , text);
    const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('VC接続時通知を変更しました')
            .setDescription(text);
      interaction.reply({embeds: [embed]});
  }
  if (interaction.customId === 'customize-l') {
    const text = interaction.fields.getTextInputValue('leave');
      await leavetext.set(interaction.guild.id , text);
      const embed = new EmbedBuilder()
              .setColor('Green')
              .setTitle('VC切断時通知を変更しました')
              .setDescription(text);
        interaction.reply({embeds: [embed]});
    }
    if (interaction.customId === 'customize-s') {
      const text = interaction.fields.getTextInputValue('start');
        await starttext.set(interaction.guild.id , text);
        const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('通話開始通知を変更しました')
                .setDescription(text);
          interaction.reply({embeds: [embed]});
      }
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

	if (interaction.customId === 'settings') {
    const selected = interaction.values[0];
    if (selected === '1') {
      await settings.set(interaction.guild.id , '1');
      await interaction.update('通知設定1に設定しました');
    } else if (selected === '2') {
      await settings.set(interaction.guild.id , '2');
      await interaction.update('通知設定2に設定しました');
    }
	}
});


client.on('voiceStateUpdate', (oldState, newState) => {
  if(newState.member.user.bot) return;
  !(async () => {
    const channelID = await vcch.get(newState.guild.id)
    const settingsc = await settings.get(newState.guild.id)
    const channel = await client.channels.cache.get(channelID);
    const jointextc = await jointext.get(newState.guild.id)
    const leavetextc = await leavetext.get(oldState.guild.id)
    const starttextc = await starttext.get(newState.guild.id)

    const sum = await sumdata.get(`${newState.guild.id} and ${newState.member.id}` )

    if(sum == undefined){
      await sumdata.set(`${newState.guild.id} and ${newState.member.id}` , "0")
    }


    try{
    // Check if the user has joined a voice channel
    if (!oldState.channel && newState.channel) {

      let date = await new Date().getTime()
      await log.set(`${newState.guild.id} and ${newState.member.id}` , date);

      if(newState.channel.members.size == 1){
        if(starttextc == undefined){
          const titleinp = `${oldState.member.displayName} が通話を開始しました`
          const joinimage = new AttachmentBuilder()
 	          .setName("login.png")
 	          .setFile("./login.png")
          const embed = new EmbedBuilder()
            .setAuthor({ name: oldState.member.displayName, iconURL: newState.member.displayAvatarURL()})
            .setThumbnail(newState.member.displayAvatarURL())
            .setColor('Green')
            .setTitle(titleinp)
            .setDescription(`${newState.channel} `)
            .setFooter({ text: 'JOIN', iconURL: "attachment://login.png" })
          channel.send({files: [joinimage],embeds: [embed]});
        }
        else{
          const titleinp = starttextc.replace('@',`${newState.member.displayName}`)
          const joinimage = new AttachmentBuilder()
 	          .setName("login.png")
 	          .setFile("./login.png")
          const embed = new EmbedBuilder()
            .setAuthor({ name: oldState.member.displayName, iconURL: newState.member.displayAvatarURL()})
            .setThumbnail(newState.member.displayAvatarURL())
            .setColor('Green')
            .setTitle(titleinp)
            .setDescription(`${newState.channel} `)
            .setFooter({ text: 'JOIN', iconURL: "attachment://login.png" })
          channel.send({files: [joinimage],embeds: [embed]});
        }
      }
      else{
        if(settingsc == '2'){
        if(jointextc == undefined){
          const titleinp = `${oldState.member.displayName} がVCに参加しました`
          const joinimage = new AttachmentBuilder()
 	          .setName("login.png")
 	          .setFile("./login.png")
          const embed = new EmbedBuilder()
            .setAuthor({ name: oldState.member.displayName, iconURL: newState.member.displayAvatarURL()})
            .setThumbnail(newState.member.displayAvatarURL())
            .setColor('Blue')
            .setTitle(titleinp)
            .setFooter({ text: 'JOIN', iconURL: "attachment://login.png" })
          channel.send({files: [joinimage],embeds: [embed]});
        }
        else{
          const titleinp = jointextc.replace('@',`${newState.member.displayName}`)
          const joinimage = new AttachmentBuilder()
 	          .setName("login.png")
 	          .setFile("./login.png")
          const embed = new EmbedBuilder()
            .setAuthor({ name: oldState.member.displayName, iconURL: newState.member.displayAvatarURL()})
            .setThumbnail(newState.member.displayAvatarURL())
            .setColor('Blue')
            .setTitle(titleinp)
            .setFooter({ text: 'JOIN', iconURL: "attachment://login.png" })
          channel.send({files: [joinimage],embeds: [embed]});
        }
        }
      }
    }
  }catch(error){
    console.log("err1")
    const embed = new EmbedBuilder()
      .setDescription('通知を送信するチャンネルが設定されていない可能性があります')
      .setColor('Red')
      .setTitle('エラーが発生しました')
      oldState.channel.send({embeds: [embed]});
  }

  
  // VCから退出した時
  if (oldState.channel && !newState.channel) {

    let date1 = await log.get(`${oldState.guild.id} and ${oldState.member.id}`)
    let date2 = await new Date().getTime()
    let diff = date2 - date1;
    let m1 = diff / 60000
    var res = Math.round(m1)

    var displayHour = Math.floor(res/60)
    var displayMin = res % 60
    if(displayHour == "0"){
      var displayTime =`${displayMin} 分`
    }else{
      var displayTime = `${displayHour} 時間 ${displayMin}分`
    }

    const updatedsum = await Number(sum) + Number(res)
    console.log(updatedsum)

    await sumdata.set(`${oldState.guild.id} and ${oldState.member.id}` , updatedsum);

    //ここまで通話合計時間の処理
    //ここからアチーブメント
    try{
    let achievementCount0 = await achievement.get(`${oldState.guild.id} and ${oldState.member.id}`)
    console.log(achievementCount0)
    if (achievementCount0 == undefined){
      await achievement.set(`${oldState.guild.id} and ${oldState.member.id}` , 0);
    }
    let achievementCount = await achievement.get(`${oldState.guild.id} and ${oldState.member.id}`)
    if (updatedsum >= 60){
      if (achievementCount < 1){
      const leaveimage = new AttachmentBuilder()
        .setName("achievement-1.png")
        .setFile("./achievement-1.png")
      const embed = new EmbedBuilder()
        .setAuthor({ name: oldState.member.displayName, iconURL: oldState.member.displayAvatarURL()})
        .setThumbnail("attachment://achievement-1.png")
        .setColor(`Blue`)
        .setTitle(`アチーブメントを獲得しました！`)
        .setDescription(`**始まりの大地**\n1時間通話しよう`)
        .setFooter({ text: `achievement` })

      channel.send({files: [leaveimage],embeds: [embed]});
      await achievement.set(`${oldState.guild.id} and ${oldState.member.id}` , 1);
      }
    }
    if (updatedsum >= 300){
      if (achievementCount < 2){
      const leaveimage = new AttachmentBuilder()
        .setName("achievement-2.png")
        .setFile("./achievement-2.png")
      const embed = new EmbedBuilder()
        .setAuthor({ name: oldState.member.displayName, iconURL: oldState.member.displayAvatarURL()})
        .setThumbnail("attachment://achievement-2.png")
        .setColor('Blue')
        .setTitle(`アチーブメントを獲得しました！`)
        .setDescription(`**初心者卒業**\n5時間通話しよう`)
        .setFooter({ text: `achievement` })
      channel.send({files: [leaveimage],embeds: [embed]});
      await achievement.set(`${oldState.guild.id} and ${oldState.member.id}` , 2);
      }
    }
    if (updatedsum >= 600){
      if (achievementCount < 3){
      const leaveimage = new AttachmentBuilder()
        .setName("achievement-3.png")
        .setFile("./achievement-3.png")
      const embed = new EmbedBuilder()
        .setAuthor({ name: oldState.member.displayName, iconURL: oldState.member.displayAvatarURL()})
        .setThumbnail("attachment://achievement-3.png")
        .setColor('Blue')
        .setTitle(`アチーブメントを獲得しました！`)
        .setDescription(`**常連**\n10時間通話しよう`)
        .setFooter({ text: `achievement` })
      channel.send({files: [leaveimage],embeds: [embed]});
      await achievement.set(`${oldState.guild.id} and ${oldState.member.id}` , 3);
      }
    }
    if (updatedsum >= 1440){
      if (achievementCount < 4){
      const leaveimage = new AttachmentBuilder()
        .setName("achievement-4.png")
        .setFile("./achievement-4.png")
      const embed = new EmbedBuilder()
        .setAuthor({ name: oldState.member.displayName, iconURL: oldState.member.displayAvatarURL()})
        .setThumbnail("attachment://achievement-4.png")
        .setColor('Blue')
        .setTitle(`アチーブメントを獲得しました！`)
        .setDescription(`**丸一日**\n24時間通話しよう`)
        .setFooter({ text: `achievement` })
      channel.send({files: [leaveimage],embeds: [embed]});
      await achievement.set(`${oldState.guild.id} and ${oldState.member.id}` , 4);
      }
    }
    if (updatedsum >= 3000){
      if (achievementCount < 5){
      const leaveimage = new AttachmentBuilder()
        .setName("achievement-5.png")
        .setFile("./achievement-5.png")
      const embed = new EmbedBuilder()
        .setAuthor({ name: oldState.member.displayName, iconURL: oldState.member.displayAvatarURL()})
        .setThumbnail("attachment://achievement-5.png")
        .setColor('Blue')
        .setTitle(`アチーブメントを獲得しました！`)
        .setDescription(`**通話しか勝たん**\n50時間通話しよう`)
        .setFooter({ text: `achievement` })
      channel.send({files: [leaveimage],embeds: [embed]});
      await achievement.set(`${oldState.guild.id} and ${oldState.member.id}` , 5);
      }
    }
    if (updatedsum >= 6000){
      if (achievementCount < 6){
      const leaveimage = new AttachmentBuilder()
        .setName("achievement-6.png")
        .setFile("./achievement-6.png")
      const embed = new EmbedBuilder()
        .setAuthor({ name: oldState.member.displayName, iconURL: oldState.member.displayAvatarURL()})
        .setThumbnail("attachment://achievement-6.png")
        .setColor('Blue')
        .setTitle(`アチーブメントを獲得しました！`)
        .setDescription(`**依存**\n100時間通話しよう`)
        .setFooter({ text: `achievement` })
      channel.send({files: [leaveimage],embeds: [embed]});
      await achievement.set(`${oldState.guild.id} and ${oldState.member.id}` , 6);
      }
    }
  }catch(error){
    console.log("err-acheve")
  }


    if(settingsc == '2'){
    if(leavetextc == undefined){
      const titleinp = `${oldState.member.displayName} がVCから切断しました`
      const leaveimage = new AttachmentBuilder()
 	          .setName("logout.png")
 	          .setFile("./logout.png")
      const embed = new EmbedBuilder()
        .setAuthor({ name: oldState.member.displayName, iconURL: oldState.member.displayAvatarURL()})
        .setThumbnail(oldState.member.displayAvatarURL())
        .setColor('Orange')
        .setTitle(titleinp)
        .setFooter({ text: `LEAVE  通話時間：${displayTime}`, iconURL: "attachment://logout.png" })
      channel.send({files: [leaveimage],embeds: [embed]});
    }
    else{
      const titleinp = leavetextc.replace('@',`${newState.member.displayName}`)
      const leaveimage = new AttachmentBuilder()
 	          .setName("logout.png")
 	          .setFile("./logout.png")
      const embed = new EmbedBuilder()
        .setAuthor({ name: oldState.member.displayName, iconURL: oldState.member.displayAvatarURL()})
        .setThumbnail(oldState.member.displayAvatarURL())
        .setColor('Orange')
        .setTitle(titleinp)
        .setFooter({ text: `LEAVE  通話時間：${displayTime}`, iconURL: "attachment://logout.png" })
      channel.send({files: [leaveimage],embeds: [embed]});
    }

  }
}


})()

});

client.on('messageCreate', async message => {
  if(message.author.bot) return;

  if(message.content === '(  ･ᴗ･ )⚐⚑⚐゛'){
    message.channel.send('(  ･ᴗ･ )⚐⚑⚐゛');
  }
});

client.login(token);