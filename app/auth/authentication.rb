# app/auth/authentication.rb
module Authentication
  def self.find_verified_user_from_token(token)
    return nil unless token

    begin
      puts "[authentication.rb] token before decode: #{token}"
      decoded_token = JWT.decode(token, ENV['JWT_KEY'], true, algorithm: 'HS256').first
      puts "[authentication.rb] decoded token: #{decoded_token}"
      eth_address = decoded_token['sub'].downcase
    
      user = User.find_by(eth_address: eth_address)

      if user && decoded_token['token_version'] == user.token_version
        Rails.logger.info "User found and token version matches"
        user
      else
        Rails.logger.error "Token validation failed due to token_version mismatch or user not found"
        nil
      end
    rescue JWT::DecodeError, JWT::ExpiredSignature => e
      Rails.logger.error "JWT decode error: #{e.message}"
      nil
    end
  end
end
