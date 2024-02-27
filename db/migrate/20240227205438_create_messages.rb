class CreateMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :messages do |t|
      t.references :dm, null: false, foreign_key: true
      t.references :sender, null: false, foreign_key: {to_table: :nfts}
      t.text :content

      t.timestamps
    end
  end
end
