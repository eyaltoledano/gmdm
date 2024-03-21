# app/serializers/dm_serializer.rb

class DmSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at
  has_many :messages

  class MessageSerializer < ActiveModel::Serializer
    attributes :id, :content, :created_at, :updated_at, :nft_name, :nft_image_url, :nft_collection_slug, :nft_token_id, :message_type

    def nft_name
      object.sender.name
    end

    def nft_image_url
      object.sender.image_url
    end

    def nft_collection_slug
      object.sender.collection.slug
    end

    def nft_token_id
      object.sender.token_id
    end

    def message_type
      object.sender.user_id == current_user.id ? 'sent' : 'received'
    end
  end
end
