class CollectionSerializer < ActiveModel::Serializer
  attributes :id, :name, :contract_address, :active
end
