class Api::V1::NftsController < ApplicationController

    def show
        collection = Collection.find_by(slug: params[:slug])
        if collection
          nft = collection.nfts.find_by(token_id: params[:token_id])
          if nft
            render json: nft
          else
            render json: { error: 'NFT not found' }, status: :not_found
          end
        else
          render json: { error: 'Collection not found' }, status: :not_found
        end
    end
end
