# app/serializers/dm_serializer.rb

class DmSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at, :user_nft_id, :created_at_pretty_with_time
  has_many :messages
  has_many :nfts

  def user_nft_id
    nft = object.nfts.find { |nft| nft.user_id == current_user.id } 
    nft.id
  end

  def created_at_pretty_with_time
    if object.created_at.to_date == Date.today
      object.created_at.strftime('%I:%M %p')
    else
      object.created_at.strftime('%b %e, %Y')
    end

  end
end
