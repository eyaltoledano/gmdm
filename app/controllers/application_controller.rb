class ApplicationController < ActionController::Base
    before_action :authenticate_request!, except: [:payload, :login, :logout]
    
    private

    def current_user
      @current_user
    end

    def authenticate_request!
      token = cookies.encrypted[:auth_token]
      return false unless token

      begin
          decoded_token = JWT.decode(token, ENV['JWT_KEY'], true, { algorithm: 'HS256' }).first
          eth_address = decoded_token['sub'].downcase
          user = User.find_by(eth_address: eth_address)
          if user && decoded_token['token_version'] == user.token_version
            @current_user = user
          else
            # The token is invalid due to token_version mismatch or user not found
            Rails.logger.error "Token validation failed due to token_version mismatch or user not found"
            @current_user = nil
            false
          end

      rescue JWT::DecodeError, JWT::ExpiredSignature => e
          Rails.logger.error "JWT decode error: #{e.message}"
          false
      end
    end
end
