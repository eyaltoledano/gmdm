# doodles contract: 0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e
# bayc contract: 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D
# mayc contract: 0x60E4d786628Fea6478F785A6d7e704777c86a7c6
# pudgy penguins contract: 0xBd3531dA5CF5857e7CfAA92426877b022e612cf8
# cryptopunks contract: 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB
# azuki contract: 0xED5AF388653567Af2F388E6224dC7C4b3241C544
# moonbirds contract: 0x23581767a106ae21c074b2276D25e5C3e136a68b
# clonex contract: 0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B

class CollectionSeeder
    def initialize(contract_address)
      @contract_address = contract_address
      @alchemy_service = AlchemyApiService.new
    end
  
    def seed_collection
        puts "=================== Collection Seeder ==================="
        puts "🚀 Creating or updating collection for contract: #{@contract_address}"
        collection_metadata = @alchemy_service.get_contract_metadata(@contract_address)
        collection = Collection.find_or_initialize_by(contract_address: @contract_address)
        collection.name = collection_metadata['name']
        collection.symbol = collection_metadata['symbol']
        collection.description = collection_metadata['openSeaMetadata']['description']
        collection.logo_url = collection_metadata['openSeaMetadata']['imageUrl']
        collection.featured_image_url = collection_metadata['openSeaMetadata']['bannerImageUrl']
        collection.card_image_url = collection_metadata['openSeaMetadata']['bannerImageUrl']
        collection.slug = collection_metadata['openSeaMetadata']['collectionSlug']
        collection.manager_address = collection_metadata['contractDeployer']
        collection.active = true
        collection.upgraded = false

        puts "✅ Collection #{collection.name} processed. Saving..."

        # Save the collection if it's new or has any changes
        collection.save if collection.new_record? || collection.changed?
        puts "🫴 Grabbing NFTs for collection: #{collection.name}"

        # Fetch NFTs for the collection and create or update them
        nfts = @alchemy_service.get_nfts_for_contract(@contract_address)

        tokens = nfts.map do |nft|
            {
              contractAddress: nft['contract']['address'],
              tokenId: nft['tokenId'],
              tokenType: nft['tokenType'] 
            }
        end

        puts "✅ Found #{nfts.size} NFTs for the #{collection.name} collection. Collecting metadata, this is the part that takes a while..."
        metadata_batch = @alchemy_service.get_nft_metadata_batch(tokens)
        puts "🎨 NFT Metadata collected for all NFTs in the #{collection.name} collection."
        puts "🌱 Seeding NFTs for collection: #{collection.name}"
        
        if metadata_batch
            metadata_batch.each do |nft_data|
              nft = collection.nfts.find_or_initialize_by(token_id: nft_data['tokenId'].to_s)
              nft.traits = nft_data["raw"]["metadata"]["attributes"] if nft_data["raw"] && nft_data["raw"]["metadata"] && nft_data["raw"]["metadata"]["attributes"]
              nft.image_url = nft_data["image"]["pngUrl"] if nft_data["image"] && nft_data["image"]["pngUrl"]
              nft.token_id = nft_data["tokenId"]
              nft.name = nft_data["name"] || "#{collection.symbol} ##{nft.token_id}"
              puts "✨ #{nft.name} processed. Saving..."
              if nft.new_record? || nft.changed?
                unless nft.save
                  puts "Failed to save NFT #{nft.token_id}: #{nft.errors.full_messages.join(", ")}"
                end
              end
            end
        else
            puts "❌ No NFT metadata found in batch response."
        end
        puts "🏁 Closing up..."
        puts "👀 Collection: #{collection}"
        puts "🤜🤛 Seeded #{collection.nfts.count} NFTs for collection: #{collection.name}"
        puts "🎉 Seeding completed for contract: #{@contract_address}"
    rescue => e
        puts "⚠️ Failed to seed collection: #{e.message}"
    end
  end
  