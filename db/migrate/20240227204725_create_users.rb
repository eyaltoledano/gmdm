class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :eth_address
      t.timestamp :last_seen
      t.string :email
      t.string :username

      t.timestamps
    end
    add_index :users, 'lower(eth_address)', unique: true, name: 'index_users_on_lower_eth_address'
  end  
end
