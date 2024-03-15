require 'net/http'
require 'uri'
require 'json'

#  Alchemy NFT API Endpoints
#  https://docs.alchemy.com/reference/nft-api-endpoints

class AlchemyApiService
    BASE_URL = "https://eth-mainnet.g.alchemy.com/nft/v3/"
    API_KEY = ENV['ALCHEMY_KEY']

    def initialize
        @api_key = API_KEY
    end

    # VERIFIED
    def get_nfts_for_owner(owner_address, contract_addresses = [], page_size = 100, with_metadata = true )
        endpoint = "#{BASE_URL}#{@api_key}/getNFTsForOwner/"
        params = { 
            owner: owner_address, 
            pageSize: page_size, 
            # withMetadata: with_metadata, 
            orderBy: 'transferTime', 
            # excludeFilters: ['SPAM'], 
            # spamConfidenceLevel: 'HIGH'
        }
        # Convert contractAddresses array to a hash where each address is a separate key with the same name
        contract_addresses_params = contract_addresses.each_with_index.map { |address, index| 
            ["contractAddresses[]", address]
        }.to_h
        # Merge the contract addresses params with the base params
        complete_params = params.merge(contract_addresses_params)
        # Pass the complete params to make_request
        make_request(endpoint, complete_params)
    end

    # VERIFIED
    def get_nft_metadata(contract_address, token_id, token_type = "erc721")
        endpoint = "#{BASE_URL}#{@api_key}/getNFTMetadata"
        params = { contractAddress: contract_address, tokenId: token_id, tokenType: token_type }
        make_request(endpoint, params)
    end

    # VERIFIED
    def get_contract_metadata(contract_address)
        endpoint = "#{BASE_URL}#{@api_key}/getContractMetadata"
        params = { contractAddress: contract_address }
        make_request(endpoint, params)
    end

    def get_nfts_for_contract(contract_address, collection_slug, with_metadata = true)
        endpoint = "#{BASE_URL}#{@api_key}/getNFTsForContract"
        params = { contractAddress: contract_address, collectionSlug: collection_slug, withMetadata: with_metadata }
        make_request(endpoint, params)
    end

    def get_contracts_for_owner(owner_address)
        endpoint = "#{BASE_URL}#{@api_key}/getContractsForOwner"
        params = { owner: owner_address }
        make_request(endpoint, params)
    end

    def get_owners_for_nft(contract_address, token_id)
        endpoint = "#{BASE_URL}#{@api_key}/getOwnersForNFT"
        params = { contractAddress: contract_address, tokenId: token_id }
        make_request(endpoint, params)
    end

    def get_owners_for_collection(contract_address)
        endpoint = "#{BASE_URL}#{@api_key}/getOwnersForCollection"
        params = { contractAddress: contract_address }
        make_request(endpoint, params)
    end

    def is_holder_of_collection(owner_address, contract_address)
        endpoint = "#{BASE_URL}#{@api_key}/isHolderOfCollection"
        params = { owner: owner_address, contractAddress: contract_address }
        make_request(endpoint, params)
    end

    def get_nft_metadata_batch(contract_addresses, token_ids, token_type = "erc721")
        endpoint = "#{BASE_URL}#{@api_key}/getNFTMetadataBatch"
        params = { contractAddresses: contract_addresses.join(','), tokenIds: token_ids.join(','), tokenType: token_type }
        make_request(endpoint, params)
    end

    def get_contract_metadata_batch(contract_addresses)
        endpoint = "#{BASE_URL}#{@api_key}/getContractMetadataBatch"
        params = { contractAddresses: contract_addresses.join(',') }
        make_request(endpoint, params)
    end

    def get_floor_price(contract_address)
        endpoint = "#{BASE_URL}#{@api_key}/getFloorPrice"
        params = { contractAddress: contract_address }
        make_request(endpoint, params)
    end

    def get_nft_sales(contract_address, page_size = 2)
        endpoint = "#{BASE_URL}#{@api_key}/getNFTSales"
        params = { contractAddress: contract_address, pageSize: page_size }
        make_request(endpoint, params)
    end

    def compute_rarity(contract_address, token_id)
        endpoint = "#{BASE_URL}#{@api_key}/computeRarity"
        params = { contractAddress: contract_address, tokenId: token_id }
        make_request(endpoint, params)
    end

    def summarize_nft_attributes(contract_address)
        endpoint = "#{BASE_URL}#{@api_key}/summarizeNFTAttributes"
        params = { contractAddress: contract_address }
        make_request(endpoint, params)
    end

    # Define other methods based on the API endpoints you want to use

    private

    def make_request(endpoint, params)
        uri = URI(endpoint)
        uri.query = URI.encode_www_form(params)
        response = Net::HTTP.get_response(uri)
        JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)
    rescue => e
        puts "Failed to fetch data: #{e.message}"
        nil
    end
end
