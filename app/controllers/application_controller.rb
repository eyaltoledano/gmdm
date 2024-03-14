class ApplicationController < ActionController::Base
    before_action :authenticate_request!, except: [:payload, :login]
    
    private

    def current_user
      @current_user
    end

    def authenticate_request!
      Rails.logger.debug "Cookies: #{cookies.encrypted[:auth_token]}"
      token = cookies.encrypted[:auth_token]
      return false unless token

      begin
          decoded_token = JWT.decode(token, ENV['JWT_KEY'], true, { algorithm: 'HS256' }).first
          Rails.logger.debug "Decoded token: #{decoded_token}"

          eth_address = decoded_token['sub'].downcase
          @current_user = User.find_by(eth_address: eth_address)
          Rails.logger.debug "Found user: #{@current_user.inspect}"

      rescue JWT::DecodeError, JWT::ExpiredSignature => e
          Rails.logger.error "JWT decode error: #{e.message}"
          false
      end
    end
end
