# spec/services/alchemy_api_service_spec.rb
require 'rails_helper'
require 'pry'

RSpec.describe AlchemyApiService do
  subject(:service) { described_class.new }

  let(:valid_owner_address) { '0xC35f3F92A9F27A157B309a9656CfEA30E5C9cCe3' } # poopie.eth
  let(:contract_address) { '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e' } # Doodles
  let(:collection_name) { 'Doodles' }
  let(:token_id) { '6914' } # Golden ape / unsure if string or integer

  describe "#get_nfts_for_owner" do
    it "returns NFTs of a specific contract address owned by a specific user address" do
      response = service.get_nfts_for_owner(valid_owner_address, [contract_address])
      puts "Total NFTs owned by Poopie: #{response['totalCount']}"
      doodle_nfts = response["ownedNfts"].select do |nft|
        nft["contract"]["address"].downcase == contract_address.downcase
      end
      puts "Found #{doodle_nfts.size} Doodles in Poopie's wallet."

      expect(response).to be_present
      expect(response).to have_key("ownedNfts")
      expect(response.keys).to eq(["ownedNfts", "totalCount", "validAt", "pageKey"])
      expect(doodle_nfts).to be_present
      puts "== Doodles NFTs Owned by Poopie =="
      doodle_nfts.each do |doodle|
        puts "- #{doodle["name"]}"
      end

      sleep 1
    end
  end

  describe "#get_nft_metadata" do
    it "returns metadata for an NFT provided a token id and contract address" do
      response = service.get_nft_metadata(contract_address, token_id)
      expect(response).to be_present
      expect(response).to have_key("raw")
      # Assuming you want to check for specific metadata attributes
      expect(response["contract"]["name"]).to eq(collection_name)
      expect(response["contract"]["address"]).to eq(contract_address)
      expect(response['tokenId']).to eq(token_id)
      expect(response["image"]["size"]).to be > 0
      expect(response["image"]["originalUrl"]).to be_present
      # Print some metadata for verification
      puts "#{response["name"]} is part of the '#{response["contract"]["name"]}' collection."
      puts "Image URL: #{response["image"]["pngUrl"]}"

      sleep 1
    end
  end

  describe "#get_contract_metadata" do
    it "returns metadata for a given contract address" do
      response = service.get_contract_metadata(contract_address)
      expect(response).to be_present
      expect(response).to have_key("address")
      expect(response['name']).to eq(collection_name)
      expect(response['totalSupply']).to eq("10000")
      expect(response['openSeaMetadata']).to be_present
      puts "Collection Name: #{response['name']} meta collected"
      puts "Total Supply: #{response['totalSupply']}"
      puts "Banner URL (if available): #{response['bannerUrl']}"

      sleep 1
    end
  end

  describe "#get_nfts_for_contract" do
    it "returns NFTs for a given contract address" do
      response = service.get_nfts_for_contract(contract_address)
      expect(response).to be_present
      expect(response.size).to be(500)
      puts "Successfully collected NFTs in the '#{collection_name}' collection: #{response.size.to_s} -- limited to 500 NFTs for test speed/API efficiency."
    end
  end

  describe "#get_contracts_for_owner" do
    it "returns contracts owned by a specific user address" do
      noMetadata = false
      response = service.get_contracts_for_owner(valid_owner_address, noMetadata)
      expect(response).to be_present
      expect(response.size).to be <= 500
      puts "Total contracts owned by Poopie: #{response.size.to_s}"
    end
  end

  describe "#summarize_nft_attributes" do
    it "returns summarized NFT attributes for a given contract address" do
      response = service.summarize_nft_attributes(contract_address)
      expect(response).to be_present
      expect(response).to have_key("summary")
      expect(response).to have_key("totalSupply")
      puts "Summarized NFT attributes for collection '#{response["contractAddress"]}'"
      trait_types = response["summary"].keys.size
      total_unique_attributes = response["summary"].values.sum { |category| category.keys.size }
      puts "Found #{trait_types} trait types and #{total_unique_attributes} unique traits."
      expect(trait_types).to be > 0
      expect(total_unique_attributes).to be > 0
    end
  end

  describe "#get_owners_for_nft" do
    it "returns owners for a given NFT" do
      response = service.get_owners_for_nft(contract_address, token_id)
      expect(response).to be_present
      expect(response.size).to be > 0
      puts "Total owners of NFT ID ##{token_id} in the '#{collection_name}' collection: #{response.size.to_s}"
      # puts up to 5 owners
      puts "=== Owners ==="
      response.first(5).each do |owner|
        puts "- #{owner}"
      end

    end
  end

  describe "#get_owners_for_contract" do
    it "returns owners for a given contract address" do
      response = service.get_owners_for_contract(contract_address)
      expect(response).to be_present
      expect(response.size).to be > 0
      puts "Total owners of NFTs in the '#{collection_name}' collection: #{response.size.to_s}"
      # puts up to 5 owners
      puts "=== Sample of 5 Owners ==="
      response.first(5).each do |owner|
        puts "- #{owner}"
      end
    end
  end

  describe "#get_nft_metadata_batch", :current do
    it "returns metadata for a batch of NFTs" do
      tokens = [
        {
          contractAddress: contract_address,
          tokenId: token_id,
          tokenType: "ERC721"
        }
      ]
      response = service.get_nft_metadata_batch(tokens)
      expect(response).to be_present
      expect(response.size).to be > 0
      puts "Successfully collected metadata for #{response.size} NFTs in the batch."
      # Print some metadata for verification
      puts "=== Sample NFT Metadata ==="
      response.first(5).each do |nft|
        puts "- #{nft["name"]}"
      end
    end
  end

end
