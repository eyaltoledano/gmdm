class CreateNfts < ActiveRecord::Migration[7.0]
  def change
    create_table :nfts do |t|
      t.string :contract_address
      t.string :token_id
      t.string :metadata_url
      t.string :collection_name
      t.string :owner_wallet

      t.timestamps
    end
  end
end
