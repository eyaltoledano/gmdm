# == Schema Information
#
# Table name: messages
#
#  id         :bigint           not null, primary key
#  dm_id      :bigint           not null
#  sender_id  :bigint           not null
#  content    :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Message < ApplicationRecord
  belongs_to :dm
  belongs_to :sender, class_name: 'Nft'
end
