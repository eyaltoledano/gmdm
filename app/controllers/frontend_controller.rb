class FrontendController < ApplicationController
    def app
        @env_vars = {
            react_app_alchemy_key: ENV['REACT_APP_ALCHEMY_KEY'],
            react_app_thirdweb_secret_key: ENV['REACT_APP_THIRDWEB_SECRET_KEY'],
            react_app_thirdweb_client_id: ENV['REACT_APP_THIRDWEB_CLIENT_ID']
          }
    end
end
