class AddNameToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :name, :string
  end
end
