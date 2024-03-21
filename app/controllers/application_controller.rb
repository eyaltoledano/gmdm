class ApplicationController < ActionController::Base
    before_action :authenticate_request!, except: [:payload, :login, :logout]
    
    private

    def current_user
      @current_user
    end

    def authenticate_request!
      token = cookies.encrypted[:auth_token]
      @current_user = Authentication.find_verified_user_from_token(token)
      false unless @current_user
    end
end
