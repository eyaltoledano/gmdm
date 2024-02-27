class AddUserToNfts < ActiveRecord::Migration[7.0]
  def change
    add_reference :nfts, :user, foreign_key: true
  end
end
