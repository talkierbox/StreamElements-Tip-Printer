// https://www.npmjs.com/package/node-streamelements
// Rewritten in TS for ease of use - No Linting because that's a little too much work
// Thank you to Ryan Barr for writing this library!

import request from 'request';
const HTTP = { GET: `GET`, POST: `POST`, PUT: `PUT`, DELETE: `DELETE` };

export class Wrapper {
    base: string;
    jwt: string;
    accountId: string;

  constructor(jwt: string, accountId: string, base?: string) {
    // Establish the base URL for the API.
    this.base = base || `https://api.streamelements.com/kappa/v2`;

    // Store the user's access token in the instance.
    this.jwt = jwt;

    // Store the account ID of the channel we're accessing.
    this.accountId = accountId;

  }

  // Create a generic request wrapper.
  private makeRequest(method: string, path: string, body?: { message?: any; username?: any; level?: any; id?: string; role?: any; optionId?: any; amount?: any; winnerId?: any; tickets?: any; song?: any; volume?: number; rating?: any; }, qs?: { limit?: any; offset?: any; text?: any; voice?: string; pending?: any; }) {

    // Return a promise to allow developers to appropriately handle API responses.
    return new Promise((resolve, reject) => {

      request({
        method,
        qs,
        body,
        json: true,
        url: `${this.base}/${path}`,
        headers: {
          'Authorization': `Bearer ${this.jwt}`
        }
      }, (error: any, response: { statusCode: number; }, responseBody: any) => {

        // If there is a request error, reject the Promise.
        if (error) {
          return reject(error);
        }

        // If there is an error on the response body, reject the Promise.
        if (responseBody && responseBody.error) {
          return reject(responseBody.error);
        }

        // If we receive a status code other than 2XX range, reject the Promise.
        if (response.statusCode < 200 || response.statusCode > 299) {
          return reject(`Error encountered during request to StreamElements. Status Code: ${response.statusCode}`);
        }

        // If no errors have been encountered, resolve the Promise with the response body.
        return resolve(responseBody);

      });

    });

  }

  // /activities
  getActivities(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `activities/${channel}`);
  }
  getActivity(activityId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `activities/${channel}/${activityId}`);
  }
  replayActivity(activityId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `activities/${channel}/${activityId}/replay`);
  }

  // /bot
  getBotStatus(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `bot/${channel}`);
  }
  botPartChannel(channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `bot/${channel}/part`);
  }
  botSay(message: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `bot/${channel}/say`, { message });
  }
  botJoinChannel(channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `bot/${channel}/join`);
  }
  botMute(channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `bot/${channel}/mute`);
  }
  botUnmute(channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `bot/${channel}/unmute`);
  }
  getBotUserLevels(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `bot/${channel}/levels`);
  }
  setBotUserLevel(username: any, level: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `bot/${channel}/levels`, { username, level });
  }
  deleteBotUserLevel(username: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `bot/${channel}/levels/${username}`, { id: `levels` });
  }

  // /bot/commands
  getBotCommands(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `bot/commands/${channel}`);
  }
  createBotCommand(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `bot/commands/${channel}`, options);
  }
  getDefaultBotCommands(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `bot/commands/${channel}/default`);
  }
  updateDefaultBotCommand(commandId: any, options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `bot/commands/${channel}/default/${commandId}`, options);
  }

  // /bot/timers
  getBotTimers(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `bot/timers/${channel}`);
  }
  createBotTimer(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `bot/timers/${channel}`, options);
  }
  getBotTimer(timerId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `bot/timers/${channel}/${timerId}`);
  }
  updateBotTimer(timerId: any, options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `bot/timers/${channel}/${timerId}`, options);
  }
  deleteBotTimer(timerId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `bot/timers/${channel}/${timerId}`);
  }

  // /changelogs
  getLatestChangelog() {
    return this.makeRequest(HTTP.GET, `changelogs/latest`);
  }
  getFirstChangelog() {
    return this.makeRequest(HTTP.GET, `changelogs/first`);
  }

  // /channels
  getCurrentChannel() {
    return this.makeRequest(HTTP.GET, `channels/me`);
  }
  getChannel(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `channels/${channel}`);
  }
  getChannelEmotes(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `channels/${channel}/emotes`);
  }
  getChannelDetails(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `channels/${channel}/details`);
  }
  updateChannelProfile(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `channels/${channel}/profile`, options);
  }
  getChannelUsers(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `channels/${channel}/users`);
  }
  updateUserAccessLevel(userId: any, role: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `channels/${channel}/users/${userId}`, { role });
  }
  deleteUserAccess(userId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `channels/${channel}/users/${userId}`);
  }
  roleplayAsUser(channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `channels/${channel}/roleplay`);
  }

  // /contests
  getContests(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `contests/${channel}`);
  }
  createContest(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `contests/${channel}`, options);
  }
  getCompletedContests(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `contests/${channel}/history`);
  }
  getContest(contestId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `contests/${channel}/${contestId}`);
  }
  updateContest(contestId: any, options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `contests/${channel}/${contestId}`, options);
  }
  deleteContest(contestId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `contests/${channel}/${contestId}`);
  }
  createContestBet(contestId: any, optionId: any, amount: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `contests/${channel}/${contestId}/bet`, { optionId, amount });
  }
  getContestBet(contestId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `contests/${channel}/${contestId}/bet`);
  }
  startContest(contestId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `contests/${channel}/${contestId}/start`);
  }
  setContestWinner(contestId: any, winnerId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `contests/${channel}/${contestId}/winner`, { winnerId });
  }
  refundContest(contestId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `contests/${channel}/${contestId}/refund`);
  }
  closeContest(contestId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `contests/${channel}/${contestId}/stop`);
  }

  // /giveaways
  getGiveaways(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `giveaways/${channel}`);
  }
  createGiveaway(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `giveaways/${channel}`);
  }
  getPastGiveaways(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `giveaways/${channel}/history`);
  }
  getGiveaway(giveawayId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `giveaways/${channel}/${giveawayId}`);
  }
  buyGiveawayTickets(giveawayId: any, tickets: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `giveaways/${channel}/${giveawayId}`, { tickets });
  }
  updateGiveaway(giveawayId: any, options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `giveaways/${channel}/${giveawayId}`, options);
  }
  deleteGiveaway(giveawayId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `giveaways/${channel}/${giveawayId}`);
  }
  getUserGiveawayStatus(giveawayId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `giveaways/${channel}/${giveawayId}/joined`);
  }
  completeGiveaway(giveawayId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `giveaways/${channel}/${giveawayId}/complete`);
  }
  refundGiveaway(giveawayId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `giveaways/${channel}/${giveawayId}/refund`);
  }
  closeGiveaway(giveawayId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `giveaways/${channel}/${giveawayId}/close`);
  }

  // /logs
  getLogs(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `logs/${channel}`);
  }

  // /loyalty
  getLoyaltySettings(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `loyalty/${channel}`);
  }
  updateLoyaltySettings(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `loyalty/${channel}`, options);
  }

  // /overlays
  getOverlays(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `overlays/${channel}`);
  }
  createOverlay(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `overlays/${channel}`, options);
  }
  getOverlay(overlayId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `overlays/${channel}/${overlayId}`);
  }
  updateOverlay(overlayId: any, options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `overlays/${channel}/${overlayId}`, options);
  }
  deleteOverlay(overlayId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `overlays/${channel}/${overlayId}`);
  }

  // /points
  updatePoints(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `points/${channel}`, options);
  }
  getUserPoints(userId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `points/${channel}/${userId}`);
  }
  deleteUserPoints(userId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `points/${channel}/${userId}`);
  }
  addUserPoints(userId: any, amount: number, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `points/${channel}/${userId}/${Math.abs(amount)}`);
  }
  removeUserPoints(userId: any, amount: number, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `points/${channel}/${userId}/${-Math.abs(amount)}`);
  }
  getUserRank(userId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `points/${channel}/${userId}/rank`);
  }
  resetPointsLeaderboard(channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `points/${channel}/reset/current`);
  }
  resetAlltimePointsLeaderboard(channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `points/${channel}/reset/alltime`);
  }
  getTopPointsUsersAlltime(limit: any, offset: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `points/${channel}/alltime`, {}, { limit, offset });
  }
  getTopPointsUsers(limit: any, offset: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `points/${channel}/top`, {}, { limit, offset });
  }

  // /sessions
  getUserSessionData(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `sessions/${channel}`);
  }
  updateUserSessionData(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `sessions/${channel}`, options);
  }
  resetUserSessionData(channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `sessions/${channel}/reset`);
  }
  reloadUserSessionData(channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `sessions/${channel}/reload`);
  }

  // /songrequest
  getSongRequestSettings(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `songrequest/${channel}/settings`);
  }
  updateSongRequestSettings(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `songrequest/${channel}/settings`, options);
  }
  getPublicSongRequestSettings(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `songrequest/${channel}/public`);
  }
  getSongRequestQueue(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `songrequest/${channel}/queue`);
  }
  createSongRequest(song: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `songrequest/${channel}/queue`, { song });
  }
  getSongRequestHistory(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `songrequest/${channel}/queue/history`);
  }
  skipCurrentSong(channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `songrequest/${channel}/queue/skip`);
  }
  deleteSongRequest(songId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `songrequest/${channel}/queue/${songId}`);
  }
  clearSongRequestQueue(channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `songrequest/${channel}/clear`);
  }
  getCurrentSong(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `songrequest/${channel}/playing`);
  }
  setSongRequestVolume(volumeAmount: string, channel = this.accountId) {
    const volume = parseInt(volumeAmount, 10);
    if (isNaN(volume) || volume < 0 || volume > 100) {
      throw new Error(`volumeAmount should be a number between 0 and 100.`);
    }
    return this.makeRequest(HTTP.POST, `songrequest/${channel}/player/volume`, { volume });
  }

  // /speech
  generateSpeech(text: any, voice = `Joanna`) {
    return this.makeRequest(HTTP.GET, `speech`, {}, { text, voice });
  }
  getSpeechVoices() {
    return this.makeRequest(HTTP.GET, `speech/voices`);
  }

  // /stats
  getDailyStats(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `stats/${channel}/daily`);
  }
  getMonthlyStats(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `stats/${channel}/monthly`);
  }

  // /store
  getStoreItems(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `store/${channel}/items`);
  }
  createStoreItem(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `store/${channel}/items`, options);
  }
  getStoreItem(itemId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `store/${channel}/items/${itemId}`);
  }
  updateStoreItem(itemId: any, options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `store/${channel}/items/${itemId}`);
  }
  deleteStoreItem(itemId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `store/${channel}/items/${itemId}`);
  }
  getStoreRedemptions(limit: any, offset: any, pending: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `store/${channel}/redemptions`, {}, { limit, offset, pending });
  }
  getStoreRedemption(redemptionId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `store/${channel}/redemptions/${redemptionId}`);
  }
  updateStoreRedemption(redemptionId: any, options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `store/${channel}/redemptions/${redemptionId}`, options);
  }
  deleteStoreRedemption(redemptionId: any, options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `store/${channel}/redemptions/${redemptionId}`);
  }
  createStoreRedemption(itemId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `store/${channel}/redemptions/${itemId}`);
  }

  // /streams
  getStreams(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `streams/${channel}`);
  }
  getStreamStatus(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `streams/${channel}/live`);
  }
  getStreamDetails(streamId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `streams/${channel}/${streamId}`);
  }

  // /themes
  getThemes() {
    return this.makeRequest(HTTP.GET, `themes`);
  }
  getTheme(themeId: any) {
    return this.makeRequest(HTTP.GET, `themes/${themeId}`);
  }
  createOverlayFromTheme(themeId: any, options: any) {
    return this.makeRequest(HTTP.POST, `themes/${themeId}`, options);
  }
  rateTheme(themeId: any, rating: any) {
    return this.makeRequest(HTTP.POST, `themes/${themeId}/rate`, { rating });
  }
  getThemeRatingForChannel(themeId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `themes/${themeId}/${channel}/rating`);
  }

  // /tipping
  getTippingExchangeRates() {
    return this.makeRequest(HTTP.GET, `tipping/rates`);
  }
  getTippingSettings(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `tipping/${channel}`);
  }
  updateTippingSettings(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `tipping/${channel}`, options);
  }

  // /tips
  getTips(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `tips/${channel}`);
  }
  createTip(options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.POST, `tips/${channel}`, options);
  }
  getTopTippers(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `tips/${channel}/top`);
  }
  getTipLeaderboard(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `tips/${channel}/leaderboard`);
  }
  getRecentTips(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `tips/${channel}/moderation`);
  }
  getTip(tipId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `tips/${channel}/${tipId}`);
  }
  updateTip(tipId: any, options: any, channel = this.accountId) {
    return this.makeRequest(HTTP.PUT, `tips/${channel}/${tipId}`, options);
  }
  deleteTip(tipId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `tips/${channel}/${tipId}`);
  }

  // /uploads
  getAssets(channel = this.accountId) {
    return this.makeRequest(HTTP.GET, `uploads/${channel}`);
  }
  deleteAsset(assetId: any, channel = this.accountId) {
    return this.makeRequest(HTTP.DELETE, `uploads/${channel}/${assetId}`);
  }

  // /users
  getCurrentUser() {
    return this.makeRequest(HTTP.GET, `users/current`);
  }
  getUserChannels() {
    return this.makeRequest(HTTP.GET, `users/channels`);
  }
  getChannelAccess() {
    return this.makeRequest(HTTP.GET, `users/access`);
  }

}