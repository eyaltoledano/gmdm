class Api::V1::NftsController < ApplicationController

    def index
      # get the user, then get their nfts
      return unless current_user
      nfts = current_user.nfts
      if nfts
        render json: nfts
      else
        render json: { error: 'NFTs not found' }
      end
    end

    def show
        api = AlchemyApiService.new
        collection = Collection.find_by(slug: params[:slug])
        if collection
          nft = collection.nfts.find_by(token_id: params[:token_id])
          if nft
            rarity_summary = summarize_nft_attributes(collection.contract_address)
            enriched_traits = enrich_traits_with_rarity(nft.traits, rarity_summary)
            nft.traits = enriched_traits
            render json: nft
          else
            render json: { error: 'NFT not found' }, status: :not_found
          end
        else
          render json: { error: 'Collection not found' }, status: :not_found
        end
    end

    private

    def summarize_nft_attributes(contract_address)
      api = AlchemyApiService.new
      api.summarize_nft_attributes(contract_address)
      # This should return a hash/map of rarity data for each trait type and value.
      # Example: {"head"=>{"tan"=>10}, "face"=>{"mustache"=>15}, ...}
    end
  
    def enrich_traits_with_rarity(traits, rarity_summary)
      traits.map do |trait|
        trait_type = trait["trait_type"]
        trait_value = trait["value"]
        total_supply = rarity_summary["totalSupply"].to_f
        count_for_trait = rarity_summary["summary"][trait_type][trait_value].to_f
        if count_for_trait.zero?
          puts "Rarity data missing for #{trait_type}: #{trait_value}"
          rarity_percentage = "N/A" # Handle missing data as needed
        else
          rarity_percentage = (count_for_trait / total_supply * 100).round(1)
        end
        trait.merge("rarity" => "#{rarity_percentage}%")
      end
    end
end

