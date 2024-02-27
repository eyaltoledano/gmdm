class CreateCollections < ActiveRecord::Migration[7.0]
  def change
    create_table :collections do |t|
      t.string :name, null: false
      t.string :contract_address, null: false
      t.string :logo_url
      t.string :card_image_url
      t.string :featured_image_url
      t.boolean :active, default: false
      t.boolean :upgraded, default: false
      t.string :manager_address, limit: 42, null: false
      t.string :slug, null: false

      t.timestamps
    end
    add_index :collections, :slug, unique: true
  end
end
