class Nft < ApplicationRecord
  belongs_to :user
  belongs_to :collection
  has_many :dms
  has_many :messages, through: :dms
end
