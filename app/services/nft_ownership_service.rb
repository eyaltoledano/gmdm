class NftOwnershipService
  def self.update_user_nfts(user)
    alchemy_service = AlchemyApiService.new
    owned_nfts_response = alchemy_service.get_nfts_for_owner(user.eth_address)

    return unless owned_nfts_response && owned_nfts_response['ownedNfts'].present?

    owned_identifiers = owned_nfts_response['ownedNfts'].map do |nft|
      "#{nft["contract"]["address"].downcase}_#{nft["tokenId"]}"
    end.to_set

    # Fetch NFTs that are owned by the user or are in the owned_identifiers set
    nfts_to_check = Nft.joins(:collection).where(user: user).or(
      Nft.joins(:collection).where(collection: { contract_address: owned_nfts_response['ownedNfts'].map { |nft| nft["contract"]["address"].downcase } })
    )

    nfts_to_check.find_each do |nft|
      identifier = "#{nft.collection.contract_address.downcase}_#{nft.token_id}"
      if owned_identifiers.include?(identifier)
        nft.update(user: user) unless nft.user == user
      else
        nft.update(user: nil) if nft.user == user
      end
    end
  end
end
