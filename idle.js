var Steam = require('steam');
var fs = require('fs');
var bot = new Steam.SteamClient();
var replies = ["ayy elmo", "you fookin wot m8", "meow", "no u", "no", "yes", "maybe", "no ugay", "no stop", "cats", "this is a bot you dingaling, stop chatting me"];
var logtofile = true;

if (fs.existsSync('sentryfile'))
{
    var sentry = fs.readFileSync('sentryfile');
    console.log('[STEAM] logging in with sentry ');
    bot.logOn({
      accountName: '',
      password: '',
      shaSentryfile: sentry
    });
}
else
{
    console.log('[STEAM] logging in without sentry');
    bot.logOn({
      accountName: '',
      password: '',
      authCode: ''
    });
}
bot.on('loggedOn', function() {
    console.log('[STEAM] Logged in.');
    bot.setPersonaState(Steam.EPersonaState.Online);
    bot.setPersonaName('csgosnacks.com > IdleBot');
    //Tell steam we are playing games.
    //440=tf2
    //550=l4d2 
    //730=csgo
    //570=dota2
    bot.gamesPlayed([200269, 440, 730, 730, 730, 730, 730, 570, 218800, 202351, 754, 764, 753, 240, 10, 80, 363970, 230410, 346900, 236390, 323370, 304930, 301520, 227940, 238960, 226320, 339610, 273110, 109600, 291480, 218230, 304030, 243870, 9900, 302830, 113400, 39120, 47410, 47410, 335240, 355840, 338180, 200110, 202090, 292030, 271590]);
});


bot.on('message', function(source, message, type, chatter) {
  // respond to both chat room and private messages
  var msg = ('[MSG] (' + source + "): " + message);
  console.log(msg);

  if (message.length > 0) {
    bot.sendMessage(source, replies[Math.floor(Math.random() * replies.length)], Steam.EChatEntryType.ChatMsg);
  }
  if (logtofile == true){
        fs.appendFile('msg', msg + "\n", function (err) {});
    }
});


bot.on('relationships', function () {
  for(var friend in bot.friends) {
    if(bot.friends[friend] == 2) {
      bot.addFriend(friend);
      console.log('SteamID ' + friend + ' added!')
    }
  }
});


//Accept users that add's you while you're online.

bot.on('friend', function (SteamID, Relation){
  if (Relation == 2){
        bot.addFriend(SteamID);
  console.log(SteamID + " Accepted")
}
});

bot.on('sentry', function(sentryHash)
{//A sentry file is a file that is sent once you have
//passed steamguard verification.
    console.log('[STEAM] Received sentry file.');
    fs.writeFile('sentryfile2',sentryHash,function(err) {
    if(err){
      console.log(err);
    } else {
      console.log('[FS] Saved sentry file to disk.');
    }});
});

//Handle logon errors
bot.on('error', function(e) {
console.log('[STEAM] ERROR - Logon failed');
    if (e.eresult == Steam.EResult.InvalidPassword)
    {
    console.log('Reason: invalid password');
    }
    else if (e.eresult == Steam.EResult.AlreadyLoggedInElsewhere)
    {
    console.log('Reason: already logged in elsewhere');
    }
    else if (e.eresult == Steam.EResult.AccountLogonDenied)
    {
    console.log('Reason: logon denied - steam guard needed');
    }
})