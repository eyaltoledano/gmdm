# == Schema Information
#
# Table name: dms
#
#  id                          :bigint           not null, primary key
#  nft_id                      :bigint           not null
#  target_nft_contract_address :string
#  target_nft_token_id         :string
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#
class Dm < ApplicationRecord
  belongs_to :nft
  has_many :messages
  has_many :users, through: :messages
end
