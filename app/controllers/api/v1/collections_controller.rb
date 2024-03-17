class Api::V1::CollectionsController < ApplicationController
    def index
        collections = Collection.all
        render json: collections, include_nfts: false
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
          search = params[:search]
          filter = params[:filter]
        
          nfts = case filter
            when 'token_id'
                collection.nfts.where("CAST(token_id AS TEXT) LIKE ?", "%#{search}%")
            when 'traits'
                collection.nfts.where("traits::text LIKE ?", "%#{search}%")
            else
                # Search across both token_id and traits if no specific filter is set
                collection.nfts.where("CAST(token_id AS TEXT) LIKE ? OR traits::text LIKE ?", "%#{search}%", "%#{search}%")
            end.page(params[:page]).per(25)
    
          # Prepare pagination URLs
          prev_page_url = nfts.prev_page ? "#{request.base_url}/api/v1/collections/#{collection.slug}?page=#{nfts.prev_page}" : nil
          next_page_url = nfts.next_page ? "#{request.base_url}/api/v1/collections/#{collection.slug}?page=#{nfts.next_page}" : nil
    
          render json: {
            collection: CollectionSerializer.new(collection),
            nfts: ActiveModelSerializers::SerializableResource.new(nfts, each_serializer: NftSerializer),
            pagination: {
              total_count: nfts.total_count,
              total_pages: nfts.total_pages,
              current_page: nfts.current_page,
              next_page: nfts.next_page,
              prev_page: nfts.prev_page,
              first_page: nfts.first_page?,
              last_page: nfts.last_page?,
              out_of_range: nfts.out_of_range?,
              prev_page_url: prev_page_url,
              next_page_url: next_page_url
            }
          }, status: :ok
        else
          render json: { error: "Collection not found" }, status: :not_found
        end
    end
    
    private
    
    def collection_params
        params.require(:collection).permit(:name, :user_id, :slug)
    end
end
