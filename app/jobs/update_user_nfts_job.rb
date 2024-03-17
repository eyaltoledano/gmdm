class UpdateUserNftsJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find_by(id: user_id)
    return unless user.present?

    NftOwnershipService.update_user_nfts(user)
  end
end