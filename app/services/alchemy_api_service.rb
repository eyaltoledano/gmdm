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
            withMetadata: with_metadata, 
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

    # VERIFIED
    def get_nfts_for_contract(contract_address, with_metadata = true)
        nfts = [] # Array to hold all fetched NFTs
        endpoint = "#{BASE_URL}#{@api_key}/getNFTsForContract"
        page_key = nil
      
        loop do
          params = {
            contractAddress: contract_address,
            withMetadata: with_metadata
          }
          # Include startToken in the params if it exists
          params[:pageKey] = page_key if page_key
      
          response = make_request(endpoint, params)
      
          if response && response["nfts"]
            nfts.concat(response["nfts"]) # Add the fetched NFTs to the array
            page_key = response["pageKey"] # Update the startToken with the pageKey from the response
          else
            puts "No NFTs found or error fetching NFTs."
            break
          end
          puts "Fetched #{nfts.size} NFTs so far. Fetching more..."
          # Break the loop if there's no pageKey in the response
          break unless page_key

          if ENV['RAILS_ENV'] == 'test' && nfts.size >= 500
            puts "Test environment detected. Limiting to 500 results and stopping early."
            break
          end

          sleep 0.25 # Sleep for 0.15 seconds before making the next request
        end
      
        nfts # Return the collected NFTs
        rescue => e
            puts "Failed to fetch all NFTs: #{e.message}"
            nil
    end

    # VERIFIED
    def get_contracts_for_owner(owner_address, with_metadata = false)
        contracts = [] # Array to hold all fetched contracts
        endpoint = "#{BASE_URL}#{@api_key}/getContractsForOwner"
        page_key = nil
      
        loop do
          params = {
            owner: owner_address,
            withMetadata: with_metadata
          }
          # Include pageKey in the params if it exists
          params[:pageKey] = page_key if page_key
      
          response = make_request(endpoint, params)
      
          if response && response["contracts"]
            contracts.concat(response["contracts"]) # Add the fetched contracts to the array
            page_key = response["pageKey"] # Update the page_key with the pageKey from the response
          else
            puts "No contracts found or error fetching contracts."
            break
          end
          puts "Fetched #{contracts.size} contracts so far. Fetching more..."
          # Break the loop if there's no pageKey in the response
          break unless page_key
    
          if ENV['RAILS_ENV'] == 'test' && contracts.size >= 500
            puts "Test environment detected. Limiting to 500 results and stopping early."
            break
          end
    
          sleep 0.25 # Sleep for 0.15 seconds before making the next request
        end
      
        contracts # Return the collected contracts
    rescue => e
        puts "Failed to fetch all contracts: #{e.message}"
        nil
    end 
    
    # VERIFIED
    def summarize_nft_attributes(contract_address)
        endpoint = "#{BASE_URL}#{@api_key}/summarizeNFTAttributes"
        params = { contractAddress: contract_address }
        make_request(endpoint, params)
    end

    # VERIFIED
    def get_owners_for_nft(contract_address, token_id)
        owners = [] # Array to hold all fetched owners
        endpoint = "#{BASE_URL}#{@api_key}/getOwnersForNFT"
        page_key = nil
      
        loop do
          params = {
            contractAddress: contract_address,
            tokenId: token_id
          }
          # Include pageKey in the params if it exists
          params[:pageKey] = page_key if page_key
      
          response = make_request(endpoint, params)
      
          if response && response["owners"]
            owners.concat(response["owners"]) # Add the fetched owners to the array
            page_key = response["pageKey"] # Update the pageKey with the new one from the response
          else
            puts "No owners found or error fetching owners."
            break
          end
      
          # Break the loop if there's no pageKey in the response, indicating no more pages to fetch
          break unless page_key

          if ENV['RAILS_ENV'] == 'test' && owners.size >= 500
            puts "Test environment detected. Limiting to 500 results and stopping early."
            break
          end

          sleep 0.25
        end
      
        owners # Return the collected owners
      rescue => e
        puts "Failed to fetch all owners: #{e.message}"
        nil
    end      

    # VERIFIED
    def get_owners_for_contract(contract_address, with_token_balances = false, as_of_this_block = nil)
        owners = [] # Array to hold all fetched owners
        endpoint = "#{BASE_URL}#{@api_key}/getOwnersForContract"
        page_key = nil
      
        loop do
          params = {
            contractAddress: contract_address,
            withTokenBalances: with_token_balances
          }
          params[:block] = as_of_this_block if as_of_this_block
          params[:pageKey] = page_key if page_key
      
          response = make_request(endpoint, params)
      
          if response && response["owners"]
            owners.concat(response["owners"]) # Add the fetched owners to the array
            page_key = response["pageKey"] # Update the pageKey with the new one from the response, if present
          else
            puts "No owners found or error fetching owners."
            break
          end
      
          # Break the loop if there's no pageKey in the response, indicating no more pages to fetch
          break unless page_key
        end
      
        owners # Return the collected owners
      rescue => e
        puts "Failed to fetch all owners: #{e.message}"
        nil
    end      

    # def is_holder_of_collection(owner_address, contract_address)
    #     endpoint = "#{BASE_URL}#{@api_key}/isHolderOfCollection"
    #     params = { owner: owner_address, contractAddress: contract_address }
    #     make_request(endpoint, params)
    # end

    # def get_nft_metadata_batch(contract_addresses, token_ids, token_type = "erc721")
    #     endpoint = "#{BASE_URL}#{@api_key}/getNFTMetadataBatch"
    #     params = { contractAddresses: contract_addresses.join(','), tokenIds: token_ids.join(','), tokenType: token_type }
    #     make_request(endpoint, params)
    # end

    # def get_contract_metadata_batch(contract_addresses)
    #     endpoint = "#{BASE_URL}#{@api_key}/getContractMetadataBatch"
    #     params = { contractAddresses: contract_addresses.join(',') }
    #     make_request(endpoint, params)
    # end

    # def get_floor_price(contract_address)
    #     endpoint = "#{BASE_URL}#{@api_key}/getFloorPrice"
    #     params = { contractAddress: contract_address }
    #     make_request(endpoint, params)
    # end

    # def get_nft_sales(contract_address, page_size = 2)
    #     endpoint = "#{BASE_URL}#{@api_key}/getNFTSales"
    #     params = { contractAddress: contract_address, pageSize: page_size }
    #     make_request(endpoint, params)
    # end

    # def compute_rarity(contract_address, token_id)
    #     endpoint = "#{BASE_URL}#{@api_key}/computeRarity"
    #     params = { contractAddress: contract_address, tokenId: token_id }
    #     make_request(endpoint, params)
    # end

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
