# == Schema Information
#
# Table name: users
#
#  id          :bigint           not null, primary key
#  eth_address :string
#  last_seen   :datetime
#  email       :string
#  username    :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class User < ApplicationRecord
    has_many :nfts
    before_validation :downcase_eth_address
    validates :eth_address, presence: true, uniqueness: true

    # find or create a user by eth_address
    def self.find_or_create_by(eth_address:)
        user = User.find_by(eth_address: eth_address.downcase)
        return user if user
        User.create(eth_address: eth_address)
    end

    def seen
        self.last_seen = DateTime.now
    end

    private

    def downcase_eth_address
        self.eth_address = eth_address.downcase if eth_address.present?
    end
end
