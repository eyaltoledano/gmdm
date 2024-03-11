class AddUniqueIndexToUsersEthAddress < ActiveRecord::Migration[7.0]
  def change
    add_index :users, :eth_address, unique: true
  end
end
