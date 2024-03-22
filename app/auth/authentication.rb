# app/auth/authentication.rb
module Authentication
  def self.find_verified_user_from_token(token)
    return nil unless token
    begin
      decoded_token = JWT.decode(token, ENV['JWT_KEY'], true, algorithm: 'HS256').first
      eth_address = decoded_token['sub'].downcase
    
      user = User.find_by(eth_address: eth_address)

      if user && decoded_token['token_version'] == user.token_version
        user
      else
        nil
      end
    rescue JWT::DecodeError, JWT::ExpiredSignature => e
      puts "[Authentication] JWT decode error: #{e.message}"
      nil
    end
  end
end
