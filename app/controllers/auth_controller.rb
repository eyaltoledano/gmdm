class AuthController < ApplicationController
    protect_from_forgery with: :null_session

    def index
        binding.pry
    end

    def login
    end

    def logout
    end

    private

    def generate_nonce
    end

end
