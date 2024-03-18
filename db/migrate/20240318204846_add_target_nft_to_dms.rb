class AddTargetNftToDms < ActiveRecord::Migration[7.0]
  def change
    add_reference :dms, :target_nft, null: false, foreign_key: { to_table: :nfts }
    remove_column :dms, :target_nft_contract_address, :string
    remove_column :dms, :target_nft_token_id, :string
  end
end
