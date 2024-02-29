# == Schema Information
#
# Table name: nfts
#
#  id            :bigint           not null, primary key
#  user_id       :bigint
#  collection_id :bigint           not null
#  token_id      :string
#  metadata_url  :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
class Nft < ApplicationRecord
  belongs_to :user
  belongs_to :collection
  has_many :dms
  has_many :messages, through: :dms
end
