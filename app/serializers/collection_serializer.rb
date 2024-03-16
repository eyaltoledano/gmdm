# == Schema Information
#
# Table name: collections
#
#  id                 :bigint           not null, primary key
#  active             :boolean          default(FALSE)
#  card_image_url     :string
#  contract_address   :string           not null
#  description        :text
#  featured_image_url :string
#  logo_url           :string
#  manager_address    :string(42)       not null
#  name               :string           not null
#  slug               :string           not null
#  symbol             :string
#  upgraded           :boolean          default(FALSE)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_collections_on_slug  (slug) UNIQUE
#
class CollectionSerializer < ActiveModel::Serializer
  attributes :name, :slug, :symbol, :contract_address, :active, :description, :card_image_url, :featured_image_url, :logo_url
  # include the nft's
  has_many :nfts,  if: -> { @instance_options[:include_nfts] }
end
