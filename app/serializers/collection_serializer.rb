# == Schema Information
#
# Table name: collections
#
#  id                 :bigint           not null, primary key
#  active             :boolean          default(FALSE)
#  card_image_url     :string
#  contract_address   :string           not null
#  featured_image_url :string
#  logo_url           :string
#  manager_address    :string(42)       not null
#  name               :string           not null
#  slug               :string           not null
#  upgraded           :boolean          default(FALSE)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_collections_on_slug  (slug) UNIQUE
#
class CollectionSerializer < ActiveModel::Serializer
  attributes :id, :name, :contract_address, :active, :slug
end
