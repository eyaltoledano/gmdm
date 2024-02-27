class CreateNftCollections < ActiveRecord::Migration[7.0]
  def change
    create_table :nft_collections do |t|
      t.string :name, null: false
      t.string :contract_address, null: false
      t.string :logo_url
      t.string :card_image_url
      t.string :featured_image_url
      t.boolean :active, default: false
      t.boolean :upgraded, default: false
      t.string :manager_address, limit: 42, null: false

      t.timestamps
    end

    add_index :nft_collections, :name, unique: true
    add_index :nft_collections, :contract_address, unique: true
    # Ensure manager_address is always 42 characters long
    # Note: This specific validation should be enforced in the model as ActiveRecord does not support length validation at the database level.
  end
end
