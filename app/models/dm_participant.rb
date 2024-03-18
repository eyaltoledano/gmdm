# == Schema Information
#
# Table name: dm_participants
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  dm_id      :bigint           not null
#  nft_id     :bigint           not null
#
# Indexes
#
#  index_dm_participants_on_dm_id   (dm_id)
#  index_dm_participants_on_nft_id  (nft_id)
#
# Foreign Keys
#
#  fk_rails_...  (dm_id => dms.id)
#  fk_rails_...  (nft_id => nfts.id)
#
class DmParticipant < ApplicationRecord
    belongs_to :dm
    belongs_to :nft
end
  
