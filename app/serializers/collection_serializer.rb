# == Schema Information
#
# Table name: collections
#
#  id                 :bigint           not null, primary key
#  name               :string           not null
#  contract_address   :string           not null
#  logo_url           :string
#  card_image_url     :string
#  featured_image_url :string
#  active             :boolean          default(FALSE)
#  upgraded           :boolean          default(FALSE)
#  manager_address    :string(42)       not null
#  slug               :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
class CollectionSerializer < ActiveModel::Serializer
  attributes :id, :name, :contract_address, :active, :slug
end
