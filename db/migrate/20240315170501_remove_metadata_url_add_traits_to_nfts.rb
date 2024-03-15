class RemoveMetadataUrlAddTraitsToNfts < ActiveRecord::Migration[7.0]
  def change
    remove_column :nfts, :metadata_url, :string
    add_column :nfts, :traits, :jsonb, default: {}, null: false
  end
end
