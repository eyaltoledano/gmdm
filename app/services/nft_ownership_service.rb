class NftOwnershipService
    def self.update_user_nfts(user)
      alchemy_service = AlchemyApiService.new
      owned_nfts_data = alchemy_service.get_nfts_for_owner(user.eth_address)
  
      owned_nfts_data.each do |nft_data|
        contract_address = nft_data["contractAddress"]
        token_id = nft_data["tokenId"]
  
        # Add NFT ownership to the user
        nft = Nft.find_or_initialize_by(contract_address: contract_address, token_id: token_id)
        nft.update(user: user, traits: nft_data["metadata"], image_url: nft_data["image_url"], name: nft_data["name"])
        
        # Remove NFT ownership from the user if applicable
        Nft.where(user: user).find_each do |nft|
            unless owned_nfts_identifiers.include?([nft.contract_address, nft.token_id])
              nft.update(user: nil)
            end
        end
      end
    end
end
  