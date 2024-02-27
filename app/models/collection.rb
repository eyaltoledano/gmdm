class Collection < ApplicationRecord
    before_validation :generate_slug

    has_many :nfts

    validates :name, presence: true
    validates :slug, uniqueness: true, presence: true

    def generate_slug
        self.slug = name.to_s.parameterize unless slug.present?
    end

end
