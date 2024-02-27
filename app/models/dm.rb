class Dm < ApplicationRecord
  belongs_to :nft
  has_many :messages
end
