class CreateDmParticipants < ActiveRecord::Migration[7.0]
  def change
    create_table :dm_participants do |t|
      t.references :dm, null: false, foreign_key: true
      t.references :nft, null: false, foreign_key: true

      t.timestamps
    end
  end
end
