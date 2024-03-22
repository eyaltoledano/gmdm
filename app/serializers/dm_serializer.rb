# app/serializers/dm_serializer.rb

class DmSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at, :user_nft_id
  has_many :messages
  has_many :nfts

  def user_nft_id
    nft = object.nfts.find { |nft| nft.user_id == current_user.id } 
    nft.id
  end
end
