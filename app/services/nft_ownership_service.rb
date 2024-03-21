class NftOwnershipService
  def self.update_user_nfts(user)
    alchemy_service = AlchemyApiService.new
    owned_nfts_response = alchemy_service.get_nfts_for_owner(user.eth_address)
    return unless owned_nfts_response && owned_nfts_response['ownedNfts'].present?

    # Assuming owned_nfts_response['ownedNfts'] is an Array of Hashes
    owned_identifiers = owned_nfts_response['ownedNfts'].map { |nft| "#{nft['contract']['address']}_#{nft['tokenId']}" }.to_set
    contract_addresses = owned_identifiers.map { |id| id.split('_').first }.uniq

    identifiers_list = owned_identifiers.to_a.map { |id| "'#{id.gsub("'", "''")}'" }.join(',')
    contract_addresses_list = contract_addresses.map { |addr| "'#{addr.gsub("'", "''")}'" }.join(',')

    # Ensuring identifiers and contract_addresses are safely formatted
    ActiveRecord::Base.connection.execute(<<-SQL)
      UPDATE nfts
      SET user_id = CASE
                      WHEN CONCAT(collections.contract_address, '_', nfts.token_id) IN (#{identifiers_list})
                      THEN #{user.id.to_i}
                      ELSE NULL
                    END
      FROM collections
      WHERE nfts.collection_id = collections.id
      AND collections.contract_address IN (#{contract_addresses_list})
    SQL
  end
end
