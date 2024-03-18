class DmChannel < ApplicationCable::Channel
  def subscribed
    stream_from "dm_#{params[:dm_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
