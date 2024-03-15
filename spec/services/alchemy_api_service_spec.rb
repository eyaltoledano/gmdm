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

  #  Test for
  # def get_contract_metadata(contract_address)
  #     endpoint = "#{BASE_URL}#{@api_key}/getContractMetadata"
  #     params = { contractAddress: contract_address }
  #     make_request(endpoint, params)
  # end
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

  # Test for
  # def get_nfts_for_contract(contract_address, collection_slug, with_metadata = true)
  #     endpoint = "#{BASE_URL}#{@api_key}/getNFTsForContract"
  #     params = { contractAddress: contract_address, collectionSlug: collection_slug, withMetadata: with_metadata }
  #     make_request(endpoint, params)
  # end

  # describe "#get_nfts_for_contract" do
  #   it "returns NFTs for a given contract address" do
  #     response = service.get_nfts_for_contract(contract_address, collection_name)
  #     expect(response).to be_present
  #     expect(response).to have_key("nfts")
  #     expect(response["nfts"]).to be_present
  #     expect(response["nfts"].size).to be > 0
  #     puts "Total NFTs in the '#{collection_name}' collection: #{response['nfts'].size}"
  #   end
  # end

end
