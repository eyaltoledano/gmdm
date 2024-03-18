class RemoveNftAndTargetNftFromDms < ActiveRecord::Migration[7.0]
  def change
    remove_column :dms, :nft_id, :bigint
    remove_column :dms, :target_nft_id, :bigint
  end
end
