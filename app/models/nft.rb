# == Schema Information
#
# Table name: nfts
#
#  id            :bigint           not null, primary key
#  image_url     :string
#  name          :string
#  traits        :jsonb            not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  collection_id :bigint           not null
#  token_id      :string
#  user_id       :bigint
#
# Indexes
#
#  index_nfts_on_collection_id                      (collection_id)
#  index_nfts_on_collection_id_and_token_id_unique  (collection_id,token_id) UNIQUE
#  index_nfts_on_user_id                            (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (collection_id => collections.id)
#  fk_rails_...  (user_id => users.id)
#
class Nft < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :collection
  has_many :dm_participants
  has_many :dms, through: :dm_participants
  validates :token_id, uniqueness: { scope: :collection_id, message: "Token ID must be unique within a collection" }
end