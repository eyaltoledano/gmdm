class Message < ApplicationRecord
  belongs_to :dm
  belongs_to :sender_nft, class_name: 'Nft'
end
