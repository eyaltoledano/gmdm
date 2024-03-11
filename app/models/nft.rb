# == Schema Information
#
# Table name: nfts
#
#  id            :bigint           not null, primary key
#  metadata_url  :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  collection_id :bigint           not null
#  token_id      :string
#  user_id       :bigint
#
# Indexes
#
#  index_nfts_on_collection_id  (collection_id)
#  index_nfts_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (collection_id => collections.id)
#  fk_rails_...  (user_id => users.id)
#
class Nft < ApplicationRecord
  belongs_to :user
  belongs_to :collection
  has_many :dms
  has_many :messages, through: :dms
end
