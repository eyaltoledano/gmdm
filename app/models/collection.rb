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
#  upgraded           :boolean          default(FALSE)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_collections_on_slug  (slug) UNIQUE
#
class Collection < ApplicationRecord
    before_validation :generate_slug

    has_many :nfts

    validates :name, presence: true
    validates :slug, uniqueness: true, presence: true

    def generate_slug
        self.slug = name.to_s.parameterize unless slug.present?
    end

end
