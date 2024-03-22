class DmChannel < ApplicationCable::Channel
  def subscribed
    dm = Dm.find_by(id: params[:dm_id])

    if dm.nil?
      puts "DM ID: #{params[:dm_id]} not found"
      reject and return
    end

    # Check if any of the current user's NFTs are part of the DM's participants
    if dm.nfts.any? { |nft| nft.user_id == current_user.id }      
      puts "Subscribed to DM ID: #{params[:dm_id]}"
      stream_for dm
    else
      puts "REJECTED subscription to DM ID: #{params[:dm_id]} - NFT is not a participant"
      reject
    end
  end

  def unsubscribed 
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    dm = Dm.find_by(id: data['dm_id'])
    binding.pry

    if dm.nil?
      puts "DM ID: #{data['dm_id']} not found - Message not sent"
      return
    end

    message = dm.messages.create!(
      sender_id: data['sender_nft_id'],
      content: data['content']
    )

    DmChannel.broadcast_to(dm, message.as_json(include: [:sender]))
  end
end
