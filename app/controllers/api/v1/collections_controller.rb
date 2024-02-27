class Api::V1::CollectionsController < ApplicationController
    def index
        collections = Collection.all
        render json: collections
    end
    
    def create
        collection = Collection.new(collection_params)
        if collection.save
            render json: collection, status: :accepted
        else
            render json: { errors: collection.errors.full_messages }, status: :unprocessible_entity
        end
    end

    def show
        collection = Collection.find_by(slug: params[:slug])
        if collection
            # render json: collection.as_json(include: :nfts)
            render json: collection
        else
            render json: { error: "Collection not found" }, status: :not_found
        end
    end
    
    private
    
    def collection_params
        params.require(:collection).permit(:name, :user_id, :slug)
    end
end
