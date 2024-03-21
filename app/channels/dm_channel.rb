class DmChannel < ApplicationCable::Channel
  def subscribed
    dm = Dm.find(params[:dm_id])
    # Check if the current_user's associated NFTs are part of the DM participants
    if dm.nfts.where(user_id: @current_user.id).exists?
      # This will subscribe the user to a specific stream of this DM
      stream_for dm
    else
      # Rejects the subscription request if the user is not part of the DM participants
      reject
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    dm = Dm.find(data['dm_id'])
    # binding.pry
    # Assuming `data` contains `content`, `dm_id`, and `sender_id`
    message = Message.create!(
      dm_id: data['dm_id'],
      sender_id: data['sender_id'],
      content: data['content']
    )

    DmChannel.broadcast_to(dm, message.as_json)
  end
end
