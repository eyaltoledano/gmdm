class ApplicationController < ActionController::API
    helper_method :current_user

    private

    def current_user
        @current_user ||= User.where(eth_address: session[:eth_address]).first if session[:eth_address]
    end
end
