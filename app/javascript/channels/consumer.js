// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `bin/rails generate channel` command.

import { createConsumer } from "@rails/actioncable"

const consumer = createConsumer(process.env.REACT_APP_WS_URL); // The URL to your WebSocket server could be passed as an argument here

export default consumer
