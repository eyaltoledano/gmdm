class CreateMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :messages do |t|
      t.references :dm, null: false, foreign_key: true
      # Explicitly specify the table name and foreign key for sender_nft
      t.references :sender_nft, null: false, foreign_key: {to_table: :nfts}
      t.text :content

      t.timestamps
    end
  end
end
