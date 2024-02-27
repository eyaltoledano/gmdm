class CreateDms < ActiveRecord::Migration[7.0]
  def change
    create_table :dms do |t|
      t.references :nft, null: false, foreign_key: true
      t.string :target_nft_contract_address
      t.string :target_nft_token_id

      t.timestamps
    end
  end
end
