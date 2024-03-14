# == Schema Information
#
# Table name: users
#
#  id            :bigint           not null, primary key
#  email         :string
#  eth_address   :string
#  last_seen     :datetime
#  token_version :integer          default(1), not null
#  username      :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_users_on_eth_address        (eth_address) UNIQUE
#  index_users_on_lower_eth_address  (lower((eth_address)::text)) UNIQUE
#
class User < ApplicationRecord
    has_many :nfts
    before_validation :downcase_eth_address
    validates :eth_address, presence: true, uniqueness: { case_sensitive: false }

    def seen
        update(last_seen: DateTime.now)
    end

    private

    def downcase_eth_address
        self.eth_address = eth_address.downcase if eth_address.present?
    end
end
