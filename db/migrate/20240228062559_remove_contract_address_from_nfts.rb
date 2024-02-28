class RemoveContractAddressFromNfts < ActiveRecord::Migration[7.0]
  def change
    remove_column :nfts, :contract_address, :string
  end
end
