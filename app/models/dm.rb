# == Schema Information
#
# Table name: dms
#
#  id                          :bigint           not null, primary key
#  target_nft_contract_address :string
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  nft_id                      :bigint           not null
#  target_nft_token_id         :string
#
# Indexes
#
#  index_dms_on_nft_id  (nft_id)
#
# Foreign Keys
#
#  fk_rails_...  (nft_id => nfts.id)
#
class Dm < ApplicationRecord
  belongs_to :nft
  has_many :messages
  has_many :users, through: :messages
end
