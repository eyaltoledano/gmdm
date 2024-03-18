# == Schema Information
#
# Table name: dms
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Dm < ApplicationRecord
  has_many :dm_participants
  has_many :nfts, through: :dm_participants
  has_many :messages
end
