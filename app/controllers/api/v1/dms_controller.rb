class Api::V1::DmsController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request!, only: [:create, :index, :show, :update, :destroy]
    serialization_scope :current_user

    def index
        # get the user, then get their nfts, then get the dm's of those nft's
        dms = current_user.nfts.map { |nft| nft.dms }.flatten
        render json: dms
    end

    def show
        dm = Dm.includes(messages: { sender: :collection }).find(params[:id])
        render json: dm, include: [:messages, :nfts]
    end      

    def create
        sender_nft = current_user.nfts.find_by(id: params[:sender_nft_id])
        receiver_nft = Nft.find_by(token_id: params[:receiver_nft_token_id])
        
        unless sender_nft && receiver_nft && receiver_nft.collection.contract_address == params[:receiver_nft_contract]
            render json: { error: "Invalid NFTs provided" }, status: :unprocessable_entity and return
        end

        dm = Dm.find_by(nfts: [sender_nft, receiver_nft])

        if dm.nil?
            ActiveRecord::Base.transaction do
                dm = Dm.create!()
                dm.nfts << sender_nft
                dm.nfts << receiver_nft
            end
        end

        dm.messages.create!(content: params[:content], sender_id: sender_nft.id)

        render json: dm, status: :created
    rescue => e
        render json: { error: e.message }, status: :unprocessable_entity
    end

    def update
        dm = Dm.find(params[:id])
        if dm.update(dm_params)
            render json: dm
        else
            render json: { error: dm.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
        dm = Dm.find(params[:id])
        dm.destroy
        render json: { status: "DM deleted" }
    end

    private

    def dm_params
        params.require(:dm).permit(:content, :sender_nft_id, :receiver_nft_contract, :receiver_nft_token_id)
    end

    def serialization_scope
        current_user
    end
end
