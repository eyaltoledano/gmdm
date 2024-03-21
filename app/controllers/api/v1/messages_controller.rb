class Api::V1::MessagesController < ApplicationController
    before_action :authenticate_request!
    before_action :set_dm, only: [:index, :create]
  
    def index
      messages = @dm.messages.order(created_at: :asc)
      render json: messages
    end
  
    def create
        # Assuming the front end sends the ID of the NFT sending the message
        sender_nft = current_user.nfts.find(params[:sender_nft_id])
        
        message = @dm.messages.build(message_params.merge(sender: sender_nft))
        if message.save
          render json: message, status: :created
        else
          render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
        end
    end
  
    private
  
    def set_dm
        @dm = Dm.find(params[:dm_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'DM not found' }, status: :not_found
    end
    
    def message_params
        params.require(:message).permit(:content)
    end
end  