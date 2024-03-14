class RenameLoginCountToTokenVersionInUsers < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :login_count, :token_version
    change_column :users, :token_version, :integer, default: 1, null: false
  end
end
