# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_03_15_194100) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "collections", force: :cascade do |t|
    t.string "name", null: false
    t.string "contract_address", null: false
    t.string "logo_url"
    t.string "card_image_url"
    t.string "featured_image_url"
    t.boolean "active", default: false
    t.boolean "upgraded", default: false
    t.string "manager_address", limit: 42, null: false
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.string "symbol"
    t.index ["slug"], name: "index_collections_on_slug", unique: true
  end

  create_table "dms", force: :cascade do |t|
    t.bigint "nft_id", null: false
    t.string "target_nft_contract_address"
    t.string "target_nft_token_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["nft_id"], name: "index_dms_on_nft_id"
  end

  create_table "messages", force: :cascade do |t|
    t.bigint "dm_id", null: false
    t.bigint "sender_id", null: false
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dm_id"], name: "index_messages_on_dm_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "nfts", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "collection_id", null: false
    t.string "token_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "traits", default: {}, null: false
    t.string "image_url"
    t.string "name"
    t.index ["collection_id", "token_id"], name: "index_nfts_on_collection_id_and_token_id_unique", unique: true
    t.index ["collection_id"], name: "index_nfts_on_collection_id"
    t.index ["user_id"], name: "index_nfts_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "eth_address"
    t.datetime "last_seen", precision: nil
    t.string "email"
    t.string "username"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "token_version", default: 1, null: false
    t.index "lower((eth_address)::text)", name: "index_users_on_lower_eth_address", unique: true
    t.index ["eth_address"], name: "index_users_on_eth_address", unique: true
  end

  add_foreign_key "dms", "nfts"
  add_foreign_key "messages", "dms"
  add_foreign_key "messages", "nfts", column: "sender_id"
  add_foreign_key "nfts", "collections"
  add_foreign_key "nfts", "users"
end
