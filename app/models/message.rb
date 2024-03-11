# == Schema Information
#
# Table name: messages
#
#  id         :bigint           not null, primary key
#  content    :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  dm_id      :bigint           not null
#  sender_id  :bigint           not null
#
# Indexes
#
#  index_messages_on_dm_id      (dm_id)
#  index_messages_on_sender_id  (sender_id)
#
# Foreign Keys
#
#  fk_rails_...  (dm_id => dms.id)
#  fk_rails_...  (sender_id => nfts.id)
#
class Message < ApplicationRecord
  belongs_to :dm
  belongs_to :sender, class_name: 'Nft'
end
