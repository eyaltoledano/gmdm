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
        binding.pry
        dm = Dm.new(dm_params)
        if dm.save
            render json: dm
        else
            render json: { error: dm.errors.full_messages }, status: :unprocessable_entity
        end
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
        params.require(:dm).permit(:name, :nft_ids => [])
    end

    def serialization_scope
        current_user
    end
end
