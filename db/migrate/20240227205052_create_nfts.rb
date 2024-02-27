class CreateNfts < ActiveRecord::Migration[7.0]
  def change
    create_table :nfts do |t|
      t.references :user, foreign_key: true
      t.string :contract_address
      t.string :token_id
      t.string :metadata_url
      t.string :collection_name

      t.timestamps
    end
  end
end
