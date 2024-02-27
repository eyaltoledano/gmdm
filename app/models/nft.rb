class Nft < ApplicationRecord
    belongs_to :user
    has_many :dms
    has_many :messages, through: :dms
end
