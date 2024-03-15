namespace :db do
  desc "Seed an NFT collection and its NFTs into the database"
  task :seed_collection, [:contract_address] => :environment do |t, args|
    contract_address = args[:contract_address]

    if contract_address.blank?
      puts "Usage: rake db:seed_collection[contract_address]"
      exit
    end

    seeder = CollectionSeeder.new(contract_address)
    seeder.seed_collection
  end
end
