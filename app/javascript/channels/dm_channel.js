import consumer from "./consumer"

consumer.subscriptions.create("DmChannel", {
  connected() {
    console.log("Connected to the channel in dm_channel.js");
  },

  disconnected() {
    console.log("Disconnected from the channel in dm_channel.js");
  },

  received(data) {
    console.log("Received in dm_channel.js:", data);
  }
});
