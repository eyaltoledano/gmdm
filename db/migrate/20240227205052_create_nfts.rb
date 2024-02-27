class CreateNfts < ActiveRecord::Migration[7.0]
  def change
    create_table :nfts do |t|
      t.references :user, foreign_key: true
      t.references :collection, foreign_key: true, null: false
      t.string :contract_address
      t.string :token_id
      t.string :metadata_url
      t.timestamps
    end
  end
end
