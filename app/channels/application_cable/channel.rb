module ApplicationCable
  class Channel < ActionCable::Channel::Base
    def subscribed
      # Every 30 seconds send a ping to keep the WebSocket connection open
      @heartbeat = Thread.new { loop { sleep 30; transmit type: 'ping' } }
    end
    
    def unsubscribed
      # Stop the thread when unsubscribed
      @heartbeat.kill if @heartbeat
    end
  end
end
