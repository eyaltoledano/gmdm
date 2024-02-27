class Dm < ApplicationRecord
  belongs_to :nft
  has_many :messages
  has_many :users, through: :messages
end
