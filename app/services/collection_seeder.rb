class CollectionSeeder
    def initialize(contract_address, collection_slug)
      @contract_address = contract_address
      @collection_slug = collection_slug
      @alchemy_service = AlchemyAPIService.new
    end
  
    def seed_collection
      collection_metadata = @alchemy_service.get_contract_metadata(@contract_address)
      collection = Collection.find_or_create_by(contract_address: @contract_address) do |c|
        c.name = collection_metadata['name']
        c.slug = @collection_slug
        # Set other metadata fields...
      end
  
      nfts = @alchemy_service.get_nfts_for_collection(@contract_address)
      nfts.each do |nft_data|
        collection.nfts.find_or_create_by(token_id: nft_data['tokenId']) do |nft|
          nft.metadata_url = nft_data['metadataUrl']
          # Set other NFT fields...
        end
      end
    rescue => e
      # Handle errors appropriately
      puts "Failed to seed collection: #{e.message}"
    end
end  