class AddUniqueIndexToNftsOnCollectionIdAndTokenId < ActiveRecord::Migration[7.0]
  def change
    add_index :nfts, [:collection_id, :token_id], unique: true, name: 'index_nfts_on_collection_id_and_token_id_unique'
  end
end
