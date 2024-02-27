class Message < ApplicationRecord
  belongs_to :dm
  belongs_to :sender, class_name: 'Nft'
end
